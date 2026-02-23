import { defineConfig } from "@banavasi/onelib";

export default defineConfig({
	name: "{{PROJECT_NAME}}",
	registry: {
		components: [],
		layouts: [],
	},
	skills: {
		curated: true,
		custom: [],
	},
	theme: {
		preset: "default",
	},
	layout: "blank",
});
