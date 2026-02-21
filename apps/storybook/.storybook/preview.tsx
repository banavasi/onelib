import type { Preview } from "@storybook/react-vite";
import React from "react";
import "./tailwind.css";

const preview: Preview = {
	parameters: {
		backgrounds: { disable: true },
		layout: "fullscreen",
	},
	decorators: [
		(Story, context) => {
			const theme = context.globals["theme"] || "dark";
			return (
				<div className={theme === "dark" ? "dark" : ""}>
					<div className="min-h-screen w-full bg-white dark:bg-gray-950 p-6 text-gray-900 dark:text-gray-100">
						<Story />
					</div>
				</div>
			);
		},
	],
	globalTypes: {
		theme: {
			description: "Global theme for components",
			toolbar: {
				title: "Theme",
				icon: "circlehollow",
				items: [
					{ value: "light", icon: "sun", title: "Light" },
					{ value: "dark", icon: "moon", title: "Dark" },
				],
				dynamicTitle: true,
			},
		},
	},
	initialGlobals: {
		theme: "dark",
	},
};

export default preview;
