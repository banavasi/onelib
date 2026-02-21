import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import PixelBlast from "./pixel-blast";

/**
 * Animated pixel/dithered pattern background with click ripples, multiple shape
 * variants, and optional liquid distortion. Uses Three.js with postprocessing.
 * Requires `three` and `postprocessing` peer dependencies. Source: ReactBits.
 */
const meta = {
	title: "Backgrounds/Pixel Blast",
	component: PixelBlast,
	argTypes: {
		variant: {
			control: "select",
			options: ["square", "circle", "triangle", "diamond"],
			description: "Shape variant of the pixel pattern",
		},
		pixelSize: {
			control: { type: "number", min: 1, max: 20, step: 1 },
			description: "Size of individual pixels",
		},
		color: {
			control: "color",
			description: "Color of the pixel pattern",
		},
		speed: {
			control: { type: "number", min: 0.1, max: 3, step: 0.1 },
			description: "Animation speed multiplier",
		},
		patternDensity: {
			control: { type: "number", min: 0.1, max: 3, step: 0.1 },
			description: "Density of the pixel pattern",
		},
		enableRipples: {
			control: "boolean",
			description: "Enable click ripple effects",
		},
		rippleSpeed: {
			control: { type: "number", min: 0.1, max: 2, step: 0.1 },
			description: "Speed of ripple propagation",
		},
	},
	args: {
		variant: "square",
		pixelSize: 3,
		color: "#B19EEF",
		speed: 0.5,
		patternDensity: 1,
	},
	decorators: [
		(Story) => (
			<div className="w-full h-[500px] relative overflow-hidden bg-black">
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof PixelBlast>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default square pixel pattern with purple color. */
export const Default: Story = {};

/** Circle variant with warm orange color. */
export const CircleVariant: Story = {
	args: {
		variant: "circle",
		color: "#FF6B35",
	},
};

/** Diamond variant with blue color. */
export const DiamondVariant: Story = {
	args: {
		variant: "diamond",
		color: "#00BFFF",
	},
};

/** Pattern with click ripple effects enabled. */
export const WithRipples: Story = {
	args: {
		enableRipples: true,
		rippleSpeed: 0.5,
	},
};
