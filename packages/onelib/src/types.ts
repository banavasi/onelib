export type ThemePreset = "default" | "neutral" | "vibrant" | "corporate" | "custom";
export type LayoutPreset =
	| "blank"
	| "marketing"
	| "dashboard"
	| "ecommerce"
	| "blog"
	| "auth"
	| "docs"
	| "portfolio";

export interface OnelibConfig {
	name: string;
	registry: {
		components: string[];
		layouts: string[];
	};
	skills: {
		curated: boolean;
		custom: string[];
	};
	theme: {
		preset: ThemePreset;
	};
	layout?: LayoutPreset;
}
