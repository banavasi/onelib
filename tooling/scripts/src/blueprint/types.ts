export const LAYOUT_PRESETS = [
	"blank",
	"marketing",
	"dashboard",
	"ecommerce",
	"blog",
	"auth",
	"docs",
	"portfolio",
] as const;

export const THEME_PRESETS = ["default", "neutral", "vibrant", "corporate"] as const;

export type LayoutPreset = (typeof LAYOUT_PRESETS)[number];
export type ThemePreset = (typeof THEME_PRESETS)[number];

export interface BlueprintPage {
	name: string;
	route: string;
	layout: LayoutPreset;
	components: string[];
	title?: string;
}

export interface OnelibBlueprint {
	$schema?: string;
	name: string;
	rootLayout: LayoutPreset;
	theme: ThemePreset;
	pages: BlueprintPage[];
}

export interface BlueprintApplyResult {
	configPath: string;
	pagesCreated: string[];
	layoutsCreated: string[];
	componentsInstalled: number;
	peerDependencies: Record<string, string>;
	peerDependenciesInstall: {
		attempted: boolean;
		command: string;
		success: boolean;
		error?: string;
	};
	theme: ThemePreset;
	rootLayout: LayoutPreset;
}
