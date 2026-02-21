import { join } from "node:path";
import { defineMain } from "@storybook/react-vite/node";
import tailwindcss from "@tailwindcss/vite";

export default defineMain({
	framework: "@storybook/react-vite",
	stories: ["../../../packages/components/src/**/*.stories.tsx"],
	addons: ["@storybook/addon-themes"],
	viteFinal: async (config) => {
		if (config.resolve) {
			config.resolve.alias = {
				...config.resolve.alias,
				"@/": join(process.cwd(), "../../packages/components/src/"),
			};
		}
		config.plugins = config.plugins || [];
		config.plugins.push(tailwindcss());
		return config;
	},
});
