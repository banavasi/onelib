import type { Preview } from "@storybook/react-vite";
import React from "react";
import "./tailwind.css";

interface ThemePreset {
	label: string;
	background: string;
	text: string;
	dot: string;
	dark: boolean;
}

const themes: Record<string, ThemePreset> = {
	dark: {
		label: "Dark",
		background: "#030712",
		text: "#f3f4f6",
		dot: "#111827",
		dark: true,
	},
	light: {
		label: "Light",
		background: "#ffffff",
		text: "#111827",
		dot: "#e5e7eb",
		dark: false,
	},
	midnight: {
		label: "Midnight",
		background: "#0f172a",
		text: "#e2e8f0",
		dot: "#1e293b",
		dark: true,
	},
	slate: {
		label: "Slate",
		background: "#1e293b",
		text: "#cbd5e1",
		dot: "#334155",
		dark: true,
	},
	warm: {
		label: "Warm",
		background: "#1c1917",
		text: "#e7e5e4",
		dot: "#292524",
		dark: true,
	},
	ocean: {
		label: "Ocean",
		background: "#0c1424",
		text: "#bfdbfe",
		dot: "#172033",
		dark: true,
	},
	neutral: {
		label: "Neutral",
		background: "#374151",
		text: "#d1d5db",
		dot: "#4b5563",
		dark: true,
	},
};

const preview: Preview = {
	parameters: {
		backgrounds: { disable: true },
		layout: "fullscreen",
	},
	decorators: [
		(Story, context) => {
			const themeKey = context.globals["theme"] || "dark";
			const theme = themes[themeKey] || themes.dark;
			return (
				<div className={theme.dark ? "dark" : ""}>
					<div
						className="min-h-screen w-full p-6"
						style={{
							backgroundColor: theme.background,
							color: theme.text,
							backgroundImage: `radial-gradient(${theme.dot} 1px, transparent 1px)`,
							backgroundSize: "24px 24px",
						}}
					>
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
				icon: "paintbrush",
				items: [
					{ value: "dark", icon: "moon", title: "Dark" },
					{ value: "light", icon: "sun", title: "Light" },
					{ value: "midnight", icon: "starhollow", title: "Midnight" },
					{ value: "slate", icon: "dashboard", title: "Slate" },
					{ value: "warm", icon: "heart", title: "Warm" },
					{ value: "ocean", icon: "globe", title: "Ocean" },
					{ value: "neutral", icon: "circle", title: "Neutral" },
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
