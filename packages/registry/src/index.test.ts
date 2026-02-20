import { describe, expect, it } from "vitest";
import { REGISTRY_VERSION } from "./index.js";

describe("@onelib/registry", () => {
	it("should export REGISTRY_VERSION", () => {
		expect(typeof REGISTRY_VERSION).toBe("string");
		expect(REGISTRY_VERSION).toMatch(/^\d+\.\d+\.\d+$/);
	});
});
