import { describe, expect, it } from "vitest";
import { VERSION } from "./index.js";

describe("onelib package", () => {
	it("should export a VERSION string", () => {
		expect(typeof VERSION).toBe("string");
		expect(VERSION).toMatch(/^\d+\.\d+\.\d+$/);
	});
});
