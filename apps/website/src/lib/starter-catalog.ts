import type { LayoutOption, ThemeOption } from "./starter-types";

export const LAYOUT_OPTIONS: LayoutOption[] = [
	{ id: "blank", label: "Blank", description: "Minimal wrapper with clean content area." },
	{ id: "marketing", label: "Marketing", description: "Hero + CTA oriented marketing shell." },
	{ id: "dashboard", label: "Dashboard", description: "Sidebar + content dashboard frame." },
	{ id: "ecommerce", label: "Ecommerce", description: "Storefront shell with promo header." },
	{ id: "blog", label: "Blog", description: "Editorial content shell with reading width." },
	{ id: "auth", label: "Auth", description: "Centered auth-focused shell." },
	{ id: "docs", label: "Docs", description: "Documentation shell with nav rail." },
	{ id: "portfolio", label: "Portfolio", description: "Project gallery and personal brand shell." },
];

export const THEME_OPTIONS: ThemeOption[] = [
	{ id: "default", label: "Default", description: "Current project baseline theme." },
	{ id: "neutral", label: "Neutral", description: "Slate grayscale with restrained accents." },
	{ id: "vibrant", label: "Vibrant", description: "High-contrast blue and cyan accents." },
	{ id: "corporate", label: "Corporate", description: "Navy-forward conservative palette." },
];
