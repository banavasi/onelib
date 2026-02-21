import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { FallingGlitch } from "./falling-glitch";

/**
 * Canvas-based falling glitch text effect with configurable colors, speed, and intensity.
 * Characters fall and randomly glitch across the canvas. Source: Sera UI.
 */
const meta = {
	title: "Backgrounds/Falling Glitch",
	component: FallingGlitch,
	argTypes: {
		glitchColors: {
			control: "object",
			description: "Array of hex colors used for glitch characters",
		},
		fontSize: {
			control: { type: "number", min: 8, max: 32, step: 1 },
			description: "Font size of the glitch characters in pixels",
		},
		backgroundColor: {
			control: "color",
			description: "Background color of the canvas",
		},
		glitchSpeed: {
			control: { type: "number", min: 10, max: 200, step: 10 },
			description: "Interval in ms between glitch updates",
		},
		glitchIntensity: {
			control: { type: "number", min: 0.01, max: 0.3, step: 0.01 },
			description: "Fraction of characters updated per glitch tick",
		},
		fallSpeed: {
			control: { type: "number", min: 0.1, max: 5, step: 0.1 },
			description: "Speed at which characters fall down the screen",
		},
		outerVignette: {
			control: "boolean",
			description: "Show a radial vignette overlay around the edges",
		},
	},
	args: {
		glitchColors: ["#ff7cce", "#7cf0ff", "#fcf07c", "#8E44AD", "#3498DB"],
		fontSize: 14,
		backgroundColor: "#080A12",
		glitchSpeed: 50,
		glitchIntensity: 0.05,
		fallSpeed: 0.75,
		outerVignette: true,
	},
	decorators: [
		(Story) => (
			<div className="w-full h-[500px] relative overflow-hidden bg-black">
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof FallingGlitch>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default falling glitch with colorful characters. */
export const Default: Story = {};

/** Falling glitch with children overlay text. */
export const WithOverlay: Story = {
	render: (args) => (
		<FallingGlitch {...args}>
			<h1 className="text-4xl font-bold text-white drop-shadow-lg">
				Hello World
			</h1>
		</FallingGlitch>
	),
};

/** High intensity glitch with faster fall speed. */
export const Intense: Story = {
	args: {
		glitchIntensity: 0.2,
		fallSpeed: 2,
		glitchSpeed: 20,
	},
};

/** Monochrome green terminal style. */
export const GreenTerminal: Story = {
	args: {
		glitchColors: ["#00ff00", "#00cc00", "#009900"],
		backgroundColor: "#000000",
	},
};
