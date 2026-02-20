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
		preset: "default" | "custom";
	};
}
