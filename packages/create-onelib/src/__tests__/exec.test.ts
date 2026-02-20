import { describe, expect, it } from "vitest";
import { execCommand } from "../utils/exec.js";

describe("execCommand", () => {
	it("runs a simple command and returns stdout", async () => {
		const result = await execCommand("echo", ["hello"]);
		expect(result.ok).toBe(true);
		if (result.ok) {
			expect(result.stdout.trim()).toBe("hello");
		}
	});

	it("returns error for nonexistent command", async () => {
		const result = await execCommand("nonexistent-cmd-xyz-123", []);
		expect(result.ok).toBe(false);
	});

	it("supports timeout", async () => {
		const result = await execCommand("sleep", ["10"], { timeoutMs: 100 });
		expect(result.ok).toBe(false);
		if (!result.ok) {
			expect(result.message).toContain("timed out");
		}
	});

	it("runs in specified cwd", async () => {
		const result = await execCommand("pwd", [], { cwd: "/tmp" });
		expect(result.ok).toBe(true);
		if (result.ok) {
			// /tmp may resolve to /private/tmp on macOS
			expect(result.stdout.trim()).toMatch(/\/tmp$/);
		}
	});
});
