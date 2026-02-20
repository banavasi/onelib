import { describe, expect, it } from "vitest";
import { SCRIPTS_VERSION } from "./index.js";

describe("@onelib/scripts", () => {
	it("should export SCRIPTS_VERSION", () => {
		expect(typeof SCRIPTS_VERSION).toBe("string");
		expect(SCRIPTS_VERSION).toMatch(/^\d+\.\d+\.\d+$/);
	});
});
