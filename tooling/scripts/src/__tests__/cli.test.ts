import { describe, expect, it } from "vitest";
import { parseCommand } from "../cli.js";

describe("parseCommand", () => {
	it('parses "update" command', () => {
		expect(parseCommand(["node", "cli.js", "update"])).toBe("update");
	});

	it('parses "skills:update" command', () => {
		expect(parseCommand(["node", "cli.js", "skills:update"])).toBe("skills:update");
	});

	it('parses "blueprint:apply" command', () => {
		expect(parseCommand(["node", "cli.js", "blueprint:apply"])).toBe("blueprint:apply");
	});

	it("returns null for unknown command", () => {
		expect(parseCommand(["node", "cli.js", "foobar"])).toBeNull();
	});

	it("returns null when no command given", () => {
		expect(parseCommand(["node", "cli.js"])).toBeNull();
	});
});
