import { describe, expect, it } from "vitest";
import { main } from "./index.js";

describe("create-onelib CLI", () => {
	it("should export a main function", () => {
		expect(typeof main).toBe("function");
	});
});
