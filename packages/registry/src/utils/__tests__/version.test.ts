import { describe, expect, it } from "vitest";
import { bumpVersion, compareVersions } from "../version.js";

describe("compareVersions", () => {
	it("returns 0 for equal versions", () => {
		expect(compareVersions("1.0.0", "1.0.0")).toBe(0);
	});

	it("returns 1 when a > b (major)", () => {
		expect(compareVersions("2.0.0", "1.0.0")).toBe(1);
	});

	it("returns -1 when a < b (major)", () => {
		expect(compareVersions("1.0.0", "2.0.0")).toBe(-1);
	});

	it("compares minor versions", () => {
		expect(compareVersions("1.2.0", "1.1.0")).toBe(1);
		expect(compareVersions("1.1.0", "1.2.0")).toBe(-1);
	});

	it("compares patch versions", () => {
		expect(compareVersions("1.0.2", "1.0.1")).toBe(1);
		expect(compareVersions("1.0.1", "1.0.2")).toBe(-1);
	});

	it("handles multi-digit versions", () => {
		expect(compareVersions("1.10.0", "1.9.0")).toBe(1);
	});
});

describe("bumpVersion", () => {
	it("bumps patch version", () => {
		expect(bumpVersion("1.0.0", "patch")).toBe("1.0.1");
	});

	it("bumps minor version and resets patch", () => {
		expect(bumpVersion("1.2.3", "minor")).toBe("1.3.0");
	});

	it("bumps major version and resets minor+patch", () => {
		expect(bumpVersion("1.2.3", "major")).toBe("2.0.0");
	});
});
