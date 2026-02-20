import { describe, expect, it } from "vitest";
import { LAYOUTS_VERSION } from "./index.js";

describe("@onelib/layouts", () => {
	it("should export LAYOUTS_VERSION", () => {
		expect(typeof LAYOUTS_VERSION).toBe("string");
		expect(LAYOUTS_VERSION).toMatch(/^\d+\.\d+\.\d+$/);
	});
});
