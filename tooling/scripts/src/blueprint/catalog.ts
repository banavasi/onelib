import type { LayoutPreset, ThemePreset } from "./types.js";

export interface LayoutPresetMeta {
	id: LayoutPreset;
	label: string;
	description: string;
}

export interface ThemePresetMeta {
	id: ThemePreset;
	label: string;
	description: string;
}

export const LAYOUT_CATALOG: LayoutPresetMeta[] = [
	{ id: "blank", label: "Blank", description: "Minimal wrapper with clean content area." },
	{ id: "marketing", label: "Marketing", description: "Hero + CTA oriented marketing shell." },
	{ id: "dashboard", label: "Dashboard", description: "Sidebar + content dashboard frame." },
	{ id: "ecommerce", label: "Ecommerce", description: "Storefront shell with promo header." },
	{ id: "blog", label: "Blog", description: "Editorial content shell with reading width." },
	{ id: "auth", label: "Auth", description: "Centered auth-focused shell." },
	{ id: "docs", label: "Docs", description: "Documentation shell with nav rail." },
	{ id: "portfolio", label: "Portfolio", description: "Project gallery and personal brand shell." },
];

export const THEME_CATALOG: ThemePresetMeta[] = [
	{ id: "default", label: "Default", description: "Current project baseline theme." },
	{ id: "neutral", label: "Neutral", description: "Slate grayscale with restrained accents." },
	{ id: "vibrant", label: "Vibrant", description: "High-contrast blue and cyan accents." },
	{ id: "corporate", label: "Corporate", description: "Navy-forward conservative palette." },
];

export const THEME_CSS: Record<ThemePreset, string> = {
	default: `:root {\n\t--onelib-accent: #0f172a;\n\t--onelib-muted: #475569;\n}\n`,
	neutral: `:root {\n\t--onelib-accent: #334155;\n\t--onelib-muted: #64748b;\n\t--onelib-surface: #f8fafc;\n}\n`,
	vibrant: `:root {\n\t--onelib-accent: #1d4ed8;\n\t--onelib-muted: #0f766e;\n\t--onelib-surface: #eff6ff;\n}\n`,
	corporate: `:root {\n\t--onelib-accent: #1e3a8a;\n\t--onelib-muted: #334155;\n\t--onelib-surface: #f1f5f9;\n}\n`,
};
