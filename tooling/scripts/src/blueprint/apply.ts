import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { scaffoldComponents } from "@banavasi/components";
import type { OnelibConfig } from "@banavasi/onelib";
import { THEME_CSS } from "./catalog.js";
import type { BlueprintApplyResult, LayoutPreset, OnelibBlueprint } from "./types.js";
import { validateBlueprint } from "./validate.js";

const THEME_START = "/* onelib:theme:start */";
const THEME_END = "/* onelib:theme:end */";
const LAYOUT_START = "/* onelib:layout:start */";
const LAYOUT_END = "/* onelib:layout:end */";
const TAILWIND_START = "/* onelib:tailwind:start */";
const TAILWIND_END = "/* onelib:tailwind:end */";

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

function ensureTailwindImport(content: string): string {
	const importStatement = '@import "tailwindcss";';
	if (content.includes(importStatement)) {
		return content;
	}
	return `${importStatement}\n${content}`;
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
\treturn <div className="min-h-screen bg-[var(--onelib-surface,#ffffff)] text-[var(--onelib-text,#0f172a)]">{children}</div>;
}
`;
	}

	const heading = layout.charAt(0).toUpperCase() + layout.slice(1);
	return `import type { ReactNode } from "react";

export default function ${heading}Layout({ children }: { children: ReactNode }) {
\treturn (
\t\t<div className="onelib-layout onelib-layout-${layout} min-h-screen bg-[var(--onelib-surface,#ffffff)] text-[var(--onelib-text,#0f172a)]">
\t\t\t<header className="onelib-layout-header border-b border-slate-200 px-6 py-4">
\t\t\t\t<strong className="text-lg">${heading} Layout</strong>
\t\t\t</header>
\t\t\t<main className="onelib-layout-content mx-auto w-full max-w-7xl px-6 py-10">{children}</main>
\t\t</div>
\t);
}
`;
}

function renderPage(page: OnelibBlueprint["pages"][number]): string {
	const title = page.title ?? page.name;
	const componentJson = JSON.stringify(page.components);

	return `export default function ${sanitizeSegment(page.name) || "Generated"}Page() {
\treturn (
\t\t<section className="space-y-10">
\t\t\t<header className="space-y-3">
\t\t\t\t<p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">${page.layout} layout</p>
\t\t\t\t<h1 className="text-4xl font-bold tracking-tight md:text-5xl">${title}</h1>
\t\t\t\t<p className="text-sm text-slate-600">Route: <code>${page.route}</code></p>
\t\t\t</header>
\t\t\t<OnelibComponentRenderer componentIds={${componentJson}} />
\t\t</section>
\t);
}

import { OnelibComponentRenderer } from "@/components/onelib/component-renderer";
`;
}

function renderComponentRenderer(componentPaths: Record<string, string>): string {
	const entries = Object.entries(componentPaths)
		.sort((a, b) => a[0].localeCompare(b[0]))
		.map(([id, importPath]) => `\t${JSON.stringify(id)}: () => import(${JSON.stringify(importPath)}),`)
		.join("\n");

	return `"use client";

import { useEffect, useState, type JSX } from "react";

type LoadedModule = Record<string, unknown> & { default?: unknown };

const loaders: Record<string, () => Promise<LoadedModule>> = {
${entries}
};

function pickRenderable(mod: LoadedModule): ((props: Record<string, unknown>) => JSX.Element) | null {
\tif (typeof mod.default === "function") {
\t\treturn mod.default as (props: Record<string, unknown>) => JSX.Element;
\t}
\tfor (const key of Object.keys(mod)) {
\t\tconst value = mod[key];
\t\tif (typeof value === "function") {
\t\t\treturn value as (props: Record<string, unknown>) => JSX.Element;
\t\t}
\t}
\treturn null;
}

function MissingComponent({ id, reason }: { id: string; reason: string }) {
\treturn (
\t\t<div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
\t\t\t<p className="text-sm font-semibold text-amber-900">Unable to render: {id}</p>
\t\t\t<p className="mt-2 text-xs text-amber-800">{reason}</p>
\t\t</div>
\t);
}

function RenderComponent({ id }: { id: string }) {
\tconst [state, setState] = useState<
\t\t{ status: "loading" } | { status: "ready"; component: (props: Record<string, unknown>) => JSX.Element } | { status: "error"; reason: string }
\t>({ status: "loading" });

\tuseEffect(() => {
\t\tlet active = true;
\t\tconst loader = loaders[id];
\t\tif (!loader) {
\t\t\tsetState({ status: "error", reason: "Component is not registered in the generated renderer." });
\t\t\treturn () => {
\t\t\t\tactive = false;
\t\t\t};
\t\t}

\t\tloader()
\t\t\t.then((mod) => {
\t\t\t\tif (!active) return;
\t\t\t\tconst component = pickRenderable(mod);
\t\t\t\tif (!component) {
\t\t\t\t\tsetState({ status: "error", reason: "No renderable export found in module." });
\t\t\t\t\treturn;
\t\t\t\t}
\t\t\t\tsetState({ status: "ready", component });
\t\t\t})
\t\t\t.catch((error: unknown) => {
\t\t\t\tif (!active) return;
\t\t\t\tconst reason = error instanceof Error ? error.message : "Unknown render error";
\t\t\t\tsetState({ status: "error", reason });
\t\t\t});

\t\treturn () => {
\t\t\tactive = false;
\t\t};
\t}, [id]);

\tif (state.status === "loading") {
\t\treturn (
\t\t\t<div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
\t\t\t\tLoading <code>{id}</code>...
\t\t\t</div>
\t\t);
\t}

\tif (state.status === "error") {
\t\treturn <MissingComponent id={id} reason={state.reason} />;
\t}

\tconst Component = state.component;
\treturn (
\t\t<div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
\t\t\t<Component />
\t\t</div>
\t);
}

export function OnelibComponentRenderer({ componentIds }: { componentIds: string[] }) {
\tif (componentIds.length === 0) {
\t\treturn (
\t\t\t<div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-600">
\t\t\t\tNo components selected for this page.
\t\t\t</div>
\t\t);
\t}

\treturn (
\t\t<div className="grid gap-6">
\t\t\t{componentIds.map((id) => <RenderComponent key={id} id={id} />)}
\t\t</div>
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
	try {
		const registryUrl = import.meta.resolve("@banavasi/components/registry.json");
		const registryPath = fileURLToPath(registryUrl);
		const parsed = JSON.parse(readFileSync(registryPath, "utf-8")) as {
			components: Array<{ name: string }>;
		};
		return new Set(parsed.components.map((entry) => entry.name));
	} catch {
		return new Set<string>();
	}
}

function getComponentImportPaths(): Record<string, string> {
	try {
		const registryUrl = import.meta.resolve("@banavasi/components/registry.json");
		const registryPath = fileURLToPath(registryUrl);
		const parsed = JSON.parse(readFileSync(registryPath, "utf-8")) as {
			components: Array<{ name: string; files?: string[] }>;
		};
		const map: Record<string, string> = {};
		for (const component of parsed.components) {
			const tsxFile = component.files?.find((file) => file.endsWith(".tsx"));
			if (!tsxFile) continue;
			const parts = tsxFile.split("/");
			if (parts.length < 3) continue;
			const category = parts[0];
			const fileBase = parts[parts.length - 1]?.replace(/\.tsx$/, "");
			if (!category || !fileBase) continue;
			map[component.name] = `@/components/${category}/${fileBase}`;
		}
		return map;
	} catch {
		return {};
	}
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
	const withTailwindImport = ensureTailwindImport(currentGlobals);
	const withTailwindSources = upsertBlock(
		withTailwindImport,
		TAILWIND_START,
		TAILWIND_END,
		'@source "../components/**/*.{js,ts,jsx,tsx,mdx}";',
	);
	const withTheme = upsertBlock(withTailwindSources, THEME_START, THEME_END, THEME_CSS[blueprint.theme]);
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
	const componentImportPaths = getComponentImportPaths();
	const rendererMap = Object.fromEntries(
		selectedComponents
			.map((id) => [id, componentImportPaths[id]])
			.filter((entry): entry is [string, string] => typeof entry[1] === "string"),
	);

	const rendererDir = join(cwd, "src/components/onelib");
	ensureDir(rendererDir);
	writeFileSync(
		join(rendererDir, "component-renderer.tsx"),
		renderComponentRenderer(rendererMap),
		"utf-8",
	);

	const hasRootPage = blueprint.pages.some((page) => page.route === "/");
	if (hasRootPage) {
		const defaultRootPage = join(appDir, "page.tsx");
		if (existsSync(defaultRootPage)) {
			rmSync(defaultRootPage);
		}
	}

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
