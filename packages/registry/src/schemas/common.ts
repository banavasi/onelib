import { z } from "zod";

export const SourceSchema = z.enum([
	"shadcn",
	"magicui",
	"aceternity",
	"onelib",
	"custom",
	"seraui",
	"reactbits",
	"skiperui",
	"buouui",
]);

export const ComponentCategorySchema = z.enum([
	"ui",
	"layout",
	"data-display",
	"feedback",
	"navigation",
	"overlay",
	"form",
	"buttons",
	"effects",
	"accordions",
	"cards",
	"sections",
	"pages",
	"backgrounds",
	"text-animations",
	"gallery",
]);

export const LayoutCategorySchema = z.enum([
	"marketing",
	"dashboard",
	"auth",
	"blog",
	"e-commerce",
	"portfolio",
	"docs",
]);

export const SkillCategorySchema = z.enum([
	"coding",
	"testing",
	"debugging",
	"architecture",
	"workflow",
	"tooling",
]);

export const SkillSourceSchema = z.enum(["supabase", "claude", "codex", "onelib", "custom"]);

export const SOURCES = SourceSchema.options;
export const COMPONENT_CATEGORIES = ComponentCategorySchema.options;
export const LAYOUT_CATEGORIES = LayoutCategorySchema.options;
export const SKILL_CATEGORIES = SkillCategorySchema.options;
export const SKILL_SOURCES = SkillSourceSchema.options;

export const SemverSchema = z.string().regex(/^\d+\.\d+\.\d+$/, "Must be a valid semver string");
