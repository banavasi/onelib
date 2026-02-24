import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { scaffoldComponents } from "../scaffold.js";

const TEST_DIR = join(import.meta.dirname, "__fixtures__/scaffold-test");
const COMPONENTS_SRC = join(TEST_DIR, "components-src");
const TARGET_DIR = join(TEST_DIR, "target");

function setupFixture(): void {
	mkdirSync(join(COMPONENTS_SRC, "buttons/basic-button"), { recursive: true });
	writeFileSync(
		join(COMPONENTS_SRC, "buttons/basic-button/basic-button.tsx"),
		"export function BasicButton() { return <button>Click</button>; }",
	);
	writeFileSync(
		join(COMPONENTS_SRC, "buttons/basic-button/basic-button.stories.tsx"),
		"// stories file - should not be copied",
	);
	writeFileSync(
		join(COMPONENTS_SRC, "buttons/basic-button/index.ts"),
		'export { BasicButton } from "./basic-button";',
	);

	mkdirSync(join(COMPONENTS_SRC, "backgrounds/aurora"), { recursive: true });
	writeFileSync(
		join(COMPONENTS_SRC, "backgrounds/aurora/aurora.tsx"),
		"export function Aurora() { return <div>Aurora</div>; }",
	);
	writeFileSync(join(COMPONENTS_SRC, "backgrounds/aurora/aurora.stories.tsx"), "// stories");
	writeFileSync(
		join(COMPONENTS_SRC, "backgrounds/aurora/index.ts"),
		'export { Aurora } from "./aurora";',
	);

	mkdirSync(join(COMPONENTS_SRC, "sections/marquee"), { recursive: true });
	writeFileSync(
		join(COMPONENTS_SRC, "sections/marquee/marquee.tsx"),
		"export function Marquee() { return <div>Marquee</div>; }",
	);
	writeFileSync(
		join(COMPONENTS_SRC, "sections/marquee/index.ts"),
		'export { Marquee } from "./marquee";',
	);

	mkdirSync(join(COMPONENTS_SRC, "gallery/dome-gallery"), { recursive: true });
	writeFileSync(
		join(COMPONENTS_SRC, "gallery/dome-gallery/dome-gallery.tsx"),
		"export function DomeGallery() { return <div>Gallery</div>; }",
	);
	writeFileSync(
		join(COMPONENTS_SRC, "gallery/dome-gallery/index.ts"),
		'export { DomeGallery } from "./dome-gallery";',
	);

	mkdirSync(join(COMPONENTS_SRC, "gallery/chroma-grid"), { recursive: true });
	writeFileSync(
		join(COMPONENTS_SRC, "gallery/chroma-grid/chroma-grid.tsx"),
		"import './chroma-grid.css'; export function ChromaGrid() { return <div />; }",
	);
	writeFileSync(
		join(COMPONENTS_SRC, "gallery/chroma-grid/chroma-grid.css"),
		".chroma-grid { display: grid; }",
	);
	writeFileSync(
		join(COMPONENTS_SRC, "registry.json"),
		JSON.stringify({
			version: "0.1.0",
			components: [
				{
					name: "chroma-grid",
					files: [
						"gallery/chroma-grid/chroma-grid.tsx",
						"gallery/chroma-grid/chroma-grid.css",
					],
				},
			],
		}),
	);

	mkdirSync(TARGET_DIR, { recursive: true });
}

function cleanFixture(): void {
	if (existsSync(TEST_DIR)) {
		rmSync(TEST_DIR, { recursive: true, force: true });
	}
}

describe("scaffoldComponents", () => {
	beforeEach(() => {
		cleanFixture();
		setupFixture();
	});

	afterEach(() => {
		cleanFixture();
	});

	it("copies .tsx files (not stories) to target grouped by category", () => {
		scaffoldComponents(COMPONENTS_SRC, TARGET_DIR);

		expect(existsSync(join(TARGET_DIR, "buttons/basic-button.tsx"))).toBe(true);
		expect(existsSync(join(TARGET_DIR, "backgrounds/aurora.tsx"))).toBe(true);
	});

	it("does not copy .stories.tsx files", () => {
		scaffoldComponents(COMPONENTS_SRC, TARGET_DIR);

		expect(existsSync(join(TARGET_DIR, "buttons/basic-button.stories.tsx"))).toBe(false);
		expect(existsSync(join(TARGET_DIR, "backgrounds/aurora.stories.tsx"))).toBe(false);
	});

	it("does not copy index.ts barrel files", () => {
		scaffoldComponents(COMPONENTS_SRC, TARGET_DIR);

		expect(existsSync(join(TARGET_DIR, "buttons/index.ts"))).toBe(false);
	});

	it("copies components from all categories to target", () => {
		scaffoldComponents(COMPONENTS_SRC, TARGET_DIR);

		expect(existsSync(join(TARGET_DIR, "buttons/basic-button.tsx"))).toBe(true);
		expect(existsSync(join(TARGET_DIR, "backgrounds/aurora.tsx"))).toBe(true);
		expect(existsSync(join(TARGET_DIR, "sections/marquee.tsx"))).toBe(true);
		expect(existsSync(join(TARGET_DIR, "gallery/dome-gallery.tsx"))).toBe(true);
	});

	it("copies sidecar css files when present", () => {
		scaffoldComponents(COMPONENTS_SRC, TARGET_DIR);

		expect(existsSync(join(TARGET_DIR, "gallery/chroma-grid.css"))).toBe(true);
	});

	it("creates a lockfile at .onelib/components.lock", () => {
		scaffoldComponents(COMPONENTS_SRC, TARGET_DIR);

		const lockPath = join(TARGET_DIR, "../.onelib/components.lock");
		expect(existsSync(lockPath)).toBe(true);

		const lock = JSON.parse(readFileSync(lockPath, "utf-8"));
		expect(lock.components["basic-button"]).toBeDefined();
		expect(lock.components["basic-button"].checksum).toMatch(/^[a-f0-9]{64}$/);
		expect(lock.components.aurora).toBeDefined();
	});

	it("returns ScaffoldResult with component count and peer dependencies", () => {
		const registry = {
			version: "0.1.0",
			components: [
				{
					name: "aurora",
					displayName: "Aurora",
					category: "backgrounds",
					source: "reactbits",
					sourceUrl: "https://reactbits.dev/backgrounds/aurora",
					version: "0.1.0",
					description: "Aurora",
					files: ["backgrounds/aurora/aurora.tsx"],
					peerDependencies: { ogl: "^1.0.0" },
					dependencies: [],
					tags: ["background"],
				},
				{
					name: "basic-button",
					displayName: "Basic Button",
					category: "buttons",
					source: "seraui",
					sourceUrl: "https://seraui.com/docs/buttons/basic",
					version: "0.1.0",
					description: "Button",
					files: ["buttons/basic-button/basic-button.tsx"],
					dependencies: [],
					tags: ["button"],
				},
			],
		};
		writeFileSync(join(COMPONENTS_SRC, "registry.json"), JSON.stringify(registry));

		const result = scaffoldComponents(COMPONENTS_SRC, TARGET_DIR);

		expect(result.componentsInstalled).toBeGreaterThanOrEqual(2);
		expect(result.peerDependencies).toEqual({ ogl: "^1.0.0" });
	});

	it("copies only selected components when include filter is provided", () => {
		scaffoldComponents(COMPONENTS_SRC, TARGET_DIR, "0.1.0", { include: ["basic-button"] });

		expect(existsSync(join(TARGET_DIR, "buttons/basic-button.tsx"))).toBe(true);
		expect(existsSync(join(TARGET_DIR, "backgrounds/aurora.tsx"))).toBe(false);
		expect(existsSync(join(TARGET_DIR, "sections/marquee.tsx"))).toBe(false);
	});
});
