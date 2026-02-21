import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineMain } from "@storybook/react-vite/node";
import tailwindcss from "@tailwindcss/vite";

const __dirname = dirname(fileURLToPath(import.meta.url));
const storybookRoot = join(__dirname, "..");

export default defineMain({
	framework: "@storybook/react-vite",
	stories: [
		"../../../packages/components/src/**/*.mdx",
		"../../../packages/components/src/**/*.stories.tsx",
	],
	addons: ["@storybook/addon-docs", "@storybook/addon-themes"],
	viteFinal: async (config) => {
		config.resolve = config.resolve || {};

		// Component peer dependencies — resolve from storybook's node_modules
		// since components live in packages/components/src/ but their deps
		// are only installed in apps/storybook/
		const sbModules = resolve(storybookRoot, "node_modules");

		config.resolve.alias = {
			...config.resolve.alias,
			"@/": join(storybookRoot, "../../packages/components/src/"),
			// Storybook doc blocks — needed for MDX files in packages/components/
			"@storybook/addon-docs/blocks": join(sbModules, "@storybook/addon-docs/dist/blocks.js"),
			// Component peer dependencies — all resolved from storybook node_modules
			"clsx": join(sbModules, "clsx"),
			"tailwind-merge": join(sbModules, "tailwind-merge"),
			"motion/react": join(sbModules, "motion/react"),
			"ogl": join(sbModules, "ogl"),
			"three": join(sbModules, "three"),
			"@react-three/fiber": join(sbModules, "@react-three/fiber"),
			"@use-gesture/react": join(sbModules, "@use-gesture/react"),
			"postprocessing": join(sbModules, "postprocessing"),
			"gsap": join(sbModules, "gsap"),
			"class-variance-authority": join(sbModules, "class-variance-authority"),
			"face-api.js": join(sbModules, "face-api.js"),
		};

		// Dedupe React to prevent multiple instances
		config.resolve.dedupe = ["react", "react-dom"];

		// Ensure Vite resolves bare imports from storybook's node_modules
		// even when importing from packages/components/src/
		config.resolve.modules = [sbModules, "node_modules"];

		// Allow Vite dev server to serve files from component source
		config.server = config.server || {};
		config.server.fs = config.server.fs || {};
		config.server.fs.allow = [
			...(config.server.fs.allow || []),
			join(storybookRoot, "../.."),
		];

		config.plugins = config.plugins || [];
		config.plugins.push(tailwindcss());
		return config;
	},
});
