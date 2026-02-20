import { describe, expect, it } from "vitest";
import { LayoutSchema } from "../layout.js";

const validLayout = {
	name: "dashboard-layout",
	displayName: "Dashboard Layout",
	description: "A sidebar + main content dashboard layout",
	version: "1.0.0",
	source: "onelib",
	category: "dashboard",
	dependencies: [],
	files: ["src/layouts/dashboard-layout.tsx"],
	devOnly: false,
	tags: ["dashboard", "admin"],
	slots: ["header", "sidebar", "main", "footer"],
	requiredComponents: ["sidebar-nav", "top-bar"],
};

describe("LayoutSchema", () => {
	it("accepts a valid layout", () => {
		const result = LayoutSchema.parse(validLayout);
		expect(result.name).toBe("dashboard-layout");
		expect(result.slots).toEqual(["header", "sidebar", "main", "footer"]);
		expect(result.requiredComponents).toEqual(["sidebar-nav", "top-bar"]);
	});

	it("applies default slots=[]", () => {
		const { slots, ...withoutSlots } = validLayout;
		const result = LayoutSchema.parse(withoutSlots);
		expect(result.slots).toEqual([]);
	});

	it("applies default requiredComponents=[]", () => {
		const { requiredComponents, ...withoutReq } = validLayout;
		const result = LayoutSchema.parse(withoutReq);
		expect(result.requiredComponents).toEqual([]);
	});

	it("rejects invalid layout category", () => {
		expect(() =>
			LayoutSchema.parse({ ...validLayout, category: "ui" }),
		).toThrow();
	});

	it("rejects invalid version", () => {
		expect(() =>
			LayoutSchema.parse({ ...validLayout, version: "bad" }),
		).toThrow();
	});
});
