import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { computeChecksum } from "../checksum.js";
import type { ComponentsLock } from "../scaffold.js";
import { updateComponents } from "../updater.js";

const TEST_DIR = join(import.meta.dirname, "__fixtures__/updater-test");
const SOURCE_DIR = join(TEST_DIR, "source");
const PROJECT_DIR = join(TEST_DIR, "project");
const COMPONENTS_DIR = join(PROJECT_DIR, "src/components");
const LOCK_PATH = join(PROJECT_DIR, ".onelib/components.lock");

const ORIGINAL_CONTENT = "export function Btn() { return <button>v1</button>; }";
const UPDATED_CONTENT = "export function Btn() { return <button>v2</button>; }";
const USER_MODIFIED_CONTENT = "export function Btn() { return <button>custom</button>; }";

function setupFixture(opts: {
	sourceContent: string;
	localContent: string;
	lockChecksum: string;
	lockVersion: string;
}): void {
	// Source (upstream) component
	mkdirSync(join(SOURCE_DIR, "buttons/btn"), { recursive: true });
	writeFileSync(join(SOURCE_DIR, "buttons/btn/btn.tsx"), opts.sourceContent);

	// Local installed component
	mkdirSync(join(COMPONENTS_DIR, "buttons"), { recursive: true });
	writeFileSync(join(COMPONENTS_DIR, "buttons/btn.tsx"), opts.localContent);

	// Lockfile
	const lock: ComponentsLock = {
		version: "0.1.0",
		components: {
			btn: {
				version: opts.lockVersion,
				checksum: opts.lockChecksum,
				installedAt: new Date().toISOString(),
			},
		},
	};
	mkdirSync(join(PROJECT_DIR, ".onelib"), { recursive: true });
	writeFileSync(LOCK_PATH, JSON.stringify(lock, null, "\t"), "utf-8");
}

function cleanFixture(): void {
	if (existsSync(TEST_DIR)) {
		rmSync(TEST_DIR, { recursive: true, force: true });
	}
}

describe("updateComponents", () => {
	beforeEach(cleanFixture);
	afterEach(cleanFixture);

	it("updates unmodified components with new upstream version", () => {
		setupFixture({
			sourceContent: UPDATED_CONTENT,
			localContent: ORIGINAL_CONTENT,
			lockChecksum: computeChecksum(ORIGINAL_CONTENT),
			lockVersion: "0.1.0",
		});

		const report = updateComponents(SOURCE_DIR, PROJECT_DIR);

		expect(report.updated).toContain("btn");
		expect(report.skipped).toHaveLength(0);
		const localContent = readFileSync(join(COMPONENTS_DIR, "buttons/btn.tsx"), "utf-8");
		expect(localContent).toBe(UPDATED_CONTENT);
	});

	it("skips user-modified components", () => {
		setupFixture({
			sourceContent: UPDATED_CONTENT,
			localContent: USER_MODIFIED_CONTENT,
			lockChecksum: computeChecksum(ORIGINAL_CONTENT),
			lockVersion: "0.1.0",
		});

		const report = updateComponents(SOURCE_DIR, PROJECT_DIR);

		expect(report.skipped).toContain("btn");
		expect(report.updated).toHaveLength(0);
		const localContent = readFileSync(join(COMPONENTS_DIR, "buttons/btn.tsx"), "utf-8");
		expect(localContent).toBe(USER_MODIFIED_CONTENT);
	});

	it("force-overwrites modified components when force=true", () => {
		setupFixture({
			sourceContent: UPDATED_CONTENT,
			localContent: USER_MODIFIED_CONTENT,
			lockChecksum: computeChecksum(ORIGINAL_CONTENT),
			lockVersion: "0.1.0",
		});

		const report = updateComponents(SOURCE_DIR, PROJECT_DIR, { force: true });

		expect(report.updated).toContain("btn");
		expect(report.skipped).toHaveLength(0);
		const localContent = readFileSync(join(COMPONENTS_DIR, "buttons/btn.tsx"), "utf-8");
		expect(localContent).toBe(UPDATED_CONTENT);
	});

	it("installs new components not in lockfile", () => {
		// Setup with no existing component or lock entry
		mkdirSync(join(SOURCE_DIR, "effects/glow"), { recursive: true });
		writeFileSync(
			join(SOURCE_DIR, "effects/glow/glow.tsx"),
			"export function Glow() { return <div />; }",
		);
		mkdirSync(join(COMPONENTS_DIR), { recursive: true });
		const lock: ComponentsLock = { version: "0.1.0", components: {} };
		mkdirSync(join(PROJECT_DIR, ".onelib"), { recursive: true });
		writeFileSync(LOCK_PATH, JSON.stringify(lock), "utf-8");

		const report = updateComponents(SOURCE_DIR, PROJECT_DIR);

		expect(report.added).toContain("glow");
		expect(existsSync(join(COMPONENTS_DIR, "effects/glow.tsx"))).toBe(true);
	});

	it("skips components that are already up-to-date", () => {
		setupFixture({
			sourceContent: ORIGINAL_CONTENT,
			localContent: ORIGINAL_CONTENT,
			lockChecksum: computeChecksum(ORIGINAL_CONTENT),
			lockVersion: "0.1.0",
		});

		const report = updateComponents(SOURCE_DIR, PROJECT_DIR);

		expect(report.upToDate).toContain("btn");
		expect(report.updated).toHaveLength(0);
	});

	it("collects peer dependencies from newly added components", () => {
		mkdirSync(join(SOURCE_DIR, "backgrounds/aurora"), { recursive: true });
		writeFileSync(
			join(SOURCE_DIR, "backgrounds/aurora/aurora.tsx"),
			"export function Aurora() { return <div />; }",
		);

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
			],
		};
		writeFileSync(join(SOURCE_DIR, "registry.json"), JSON.stringify(registry));

		mkdirSync(COMPONENTS_DIR, { recursive: true });
		const lock: ComponentsLock = { version: "0.1.0", components: {} };
		mkdirSync(join(PROJECT_DIR, ".onelib"), { recursive: true });
		writeFileSync(LOCK_PATH, JSON.stringify(lock), "utf-8");

		const report = updateComponents(SOURCE_DIR, PROJECT_DIR);

		expect(report.added).toContain("aurora");
		expect(report.peerDependencies).toEqual({ ogl: "^1.0.0" });
	});
});
