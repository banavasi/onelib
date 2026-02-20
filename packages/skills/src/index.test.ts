import { describe, expect, it } from "vitest";
import { SKILLS_VERSION } from "./index.js";

describe("@onelib/skills", () => {
	it("should export SKILLS_VERSION", () => {
		expect(typeof SKILLS_VERSION).toBe("string");
		expect(SKILLS_VERSION).toMatch(/^\d+\.\d+\.\d+$/);
	});
});
