import { describe, expect, it } from "vitest";
import { replacePlaceholders } from "../utils/placeholders.js";

describe("replacePlaceholders", () => {
	it("replaces {{PROJECT_NAME}} with project name", () => {
		const input = "Hello {{PROJECT_NAME}}!";
		const result = replacePlaceholders(input, { projectName: "my-app" });
		expect(result).toBe("Hello my-app!");
	});

	it("replaces multiple occurrences", () => {
		const input = "{{PROJECT_NAME}} is {{PROJECT_NAME}}";
		const result = replacePlaceholders(input, { projectName: "cool" });
		expect(result).toBe("cool is cool");
	});

	it("leaves unknown placeholders untouched", () => {
		const input = "{{UNKNOWN}} stays";
		const result = replacePlaceholders(input, { projectName: "my-app" });
		expect(result).toBe("{{UNKNOWN}} stays");
	});

	it("handles empty string", () => {
		const result = replacePlaceholders("", { projectName: "test" });
		expect(result).toBe("");
	});

	it("handles content with no placeholders", () => {
		const input = "No placeholders here";
		const result = replacePlaceholders(input, { projectName: "test" });
		expect(result).toBe("No placeholders here");
	});
});
