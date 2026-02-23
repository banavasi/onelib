import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { scaffoldComponents } from "@banavasi/components";
import componentsRegistry from "@banavasi/components/registry.json";
import type { OnelibConfig } from "@banavasi/onelib";
import { THEME_CSS } from "./catalog.js";
import type { BlueprintApplyResult, LayoutPreset, OnelibBlueprint } from "./types.js";
import { validateBlueprint } from "./validate.js";

const THEME_START = "/* onelib:theme:start */";
const THEME_END = "/* onelib:theme:end */";
const LAYOUT_START = "/* onelib:layout:start */";
const LAYOUT_END = "/* onelib:layout:end */";

function sanitizeSegment(value: string): string {
	return value.replace(/[^a-zA-Z0-9-_]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

function routeToSegments(route: string): string[] {
	if (route === "/") return [];
	return route
		.split("/")
		.filter(Boolean)
		.map((segment) => sanitizeSegment(segment));
}

function layoutGroup(layout: LayoutPreset): string {
	return `(layout-${layout})`;
}

function ensureDir(path: string): void {
	mkdirSync(path, { recursive: true });
}

function upsertBlock(content: string, start: string, end: string, block: string): string {
	const tagged = `${start}\n${block.trim()}\n${end}`;
	const pattern = new RegExp(`${start}[\\s\\S]*?${end}`, "m");
	if (pattern.test(content)) {
		return content.replace(pattern, tagged);
	}
	return `${content.trim()}\n\n${tagged}\n`;
}

function renderRootLayout(theme: string): string {
	return `import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
\ttitle: "Onelib App",
\tdescription: "Generated and managed by Onelib",
};

export default function RootLayout({
\tchildren,
}: Readonly<{
\tchildren: React.ReactNode;
}>) {
\treturn (
\t\t<html lang="en" data-onelib-theme="${theme}">
\t\t\t<body>{children}</body>
\t\t</html>
\t);
}
`;
}

function renderLayout(layout: LayoutPreset): string {
	if (layout === "blank") {
		return `import type { ReactNode } from "react";

export default function BlankLayout({ children }: { children: ReactNode }) {
\treturn <>{children}</>;
}
`;
	}

	const heading = layout.charAt(0).toUpperCase() + layout.slice(1);
	return `import type { ReactNode } from "react";

export default function ${heading}Layout({ children }: { children: ReactNode }) {
\treturn (
\t\t<div className="onelib-layout onelib-layout-${layout}">
\t\t\t<header className="onelib-layout-header">
\t\t\t\t<strong>${heading} Layout</strong>
\t\t\t</header>
\t\t\t<main className="onelib-layout-content">{children}</main>
\t\t</div>
\t);
}
`;
}

function renderPage(page: OnelibBlueprint["pages"][number]): string {
	const title = page.title ?? page.name;
	const componentItems = page.components
		.map((component) => `\t\t\t\t<li><code>${component}</code></li>`)
		.join("\n");

	return `export default function ${sanitizeSegment(page.name) || "Generated"}Page() {
\treturn (
\t\t<main style={{ padding: "2rem" }}>
\t\t\t<h1>${title}</h1>
\t\t\t<p>
\t\t\t\tRoute: <code>${page.route}</code> | Layout: <code>${page.layout}</code>
\t\t\t</p>
\t\t\t<p>Selected components for this page:</p>
\t\t\t<ul>
${componentItems}
\t\t\t</ul>
\t\t</main>
\t);
}
`;
}

function renderConfig(config: OnelibConfig): string {
	const components = JSON.stringify(config.registry.components, null, "\t");
	const layouts = JSON.stringify(config.registry.layouts, null, "\t");
	const customSkills = JSON.stringify(config.skills.custom, null, "\t");

	return `import { defineConfig } from "@banavasi/onelib";

export default defineConfig({
\tname: ${JSON.stringify(config.name)},
\tregistry: {
\t\tcomponents: ${components},
\t\tlayouts: ${layouts},
\t},
\tskills: {
\t\tcurated: ${config.skills.curated},
\t\tcustom: ${customSkills},
\t},
\ttheme: {
\t\tpreset: ${JSON.stringify(config.theme.preset)},
\t},
\tlayout: ${JSON.stringify(config.layout ?? "blank")},
});
`;
}

async function getComponentsSourcePath(): Promise<string> {
	try {
		const registryUrl = await import.meta.resolve("@banavasi/components/registry.json");
		const registryPath = fileURLToPath(registryUrl);
		return join(dirname(registryPath), "src");
	} catch {
		const fallback = fileURLToPath(new URL("../../../packages/components/registry.json", import.meta.url));
		return join(dirname(fallback), "src");
	}
}

function getKnownComponents(): Set<string> {
	const names = componentsRegistry.components.map((entry) => entry.name);
	return new Set(names);
}

function toPreset(theme: OnelibBlueprint["theme"]): OnelibConfig["theme"]["preset"] {
	if (theme === "default") return "default";
	if (theme === "neutral" || theme === "vibrant" || theme === "corporate") return theme;
	return "custom";
}

export function parseBlueprintFile(path: string): OnelibBlueprint {
	const raw = readFileSync(path, "utf-8");
	const json = JSON.parse(raw) as unknown;
	return validateBlueprint(json);
}

export async function applyBlueprint(
	blueprint: OnelibBlueprint,
	cwd: string,
	config: OnelibConfig | null,
): Promise<BlueprintApplyResult> {
	const knownComponents = getKnownComponents();
	const unknown = blueprint.pages.flatMap((page) =>
		page.components.filter((component) => !knownComponents.has(component)),
	);
	if (unknown.length > 0) {
		throw new Error(`Unknown component IDs in blueprint: ${Array.from(new Set(unknown)).join(", ")}`);
	}

	const sourceComponentsDir = await getComponentsSourcePath();
	const targetComponentsDir = join(cwd, "src/components");
	ensureDir(targetComponentsDir);
	const scaffoldResult = scaffoldComponents(sourceComponentsDir, targetComponentsDir);

	const appDir = join(cwd, "src/app");
	ensureDir(appDir);

	const usedLayouts = new Set<LayoutPreset>([blueprint.rootLayout]);
	const pagesCreated: string[] = [];
	const layoutsCreated: string[] = [];

	for (const page of blueprint.pages) {
		usedLayouts.add(page.layout);
		const groupDir = join(appDir, layoutGroup(page.layout));
		const segments = routeToSegments(page.route);
		const pageDir = join(groupDir, ...segments);
		ensureDir(pageDir);
		const pageFile = join(pageDir, "page.tsx");
		writeFileSync(pageFile, renderPage(page), "utf-8");
		pagesCreated.push(pageFile);
	}

	for (const layout of usedLayouts) {
		const dir = join(appDir, layoutGroup(layout));
		ensureDir(dir);
		const layoutFile = join(dir, "layout.tsx");
		writeFileSync(layoutFile, renderLayout(layout), "utf-8");
		layoutsCreated.push(layoutFile);
	}

	const rootLayoutPath = join(appDir, "layout.tsx");
	writeFileSync(rootLayoutPath, renderRootLayout(blueprint.theme), "utf-8");

	const globalsPath = join(appDir, "globals.css");
	const currentGlobals = existsSync(globalsPath) ? readFileSync(globalsPath, "utf-8") : "";
	const withTheme = upsertBlock(currentGlobals, THEME_START, THEME_END, THEME_CSS[blueprint.theme]);
	const withLayoutHelpers = upsertBlock(
		withTheme,
		LAYOUT_START,
		LAYOUT_END,
		`.onelib-layout { min-height: 100vh; background: var(--onelib-surface, #ffffff); }\n.onelib-layout-header { padding: 1rem 1.5rem; border-bottom: 1px solid #e2e8f0; }\n.onelib-layout-content { padding: 1.5rem; }`,
	);
	writeFileSync(globalsPath, withLayoutHelpers, "utf-8");

	const selectedComponents = Array.from(
		new Set(blueprint.pages.flatMap((page) => page.components).sort((a, b) => a.localeCompare(b))),
	);

	const nextConfig: OnelibConfig = {
		name: config?.name ?? blueprint.name,
		registry: {
			components: selectedComponents,
			layouts: Array.from(usedLayouts).sort((a, b) => a.localeCompare(b)),
		},
		skills: config?.skills ?? { curated: true, custom: [] },
		theme: { preset: toPreset(blueprint.theme) },
		layout: blueprint.rootLayout,
	};

	const configPath = join(cwd, "onelib.config.ts");
	writeFileSync(configPath, renderConfig(nextConfig), "utf-8");

	const auditPath = join(cwd, ".onelib/blueprint.applied.json");
	ensureDir(dirname(auditPath));
	writeFileSync(
		auditPath,
		JSON.stringify(
			{
				appliedAt: new Date().toISOString(),
				blueprint,
				pagesCreated,
				layoutsCreated,
			},
			null,
			"\t",
		),
		"utf-8",
	);

	return {
		configPath,
		pagesCreated,
		layoutsCreated,
		componentsInstalled: scaffoldResult.componentsInstalled,
		theme: blueprint.theme,
		rootLayout: blueprint.rootLayout,
	};
}
