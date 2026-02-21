import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import PixelSnow from "./pixel-snow";

/**
 * Three.js pixel-based snow shader with configurable flake shape, density, and wind direction.
 * Renders volumetric snowfall using raymarching through a 3D voxel grid. Source: ReactBits.
 */
const meta = {
	title: "Backgrounds/PixelSnow",
	component: PixelSnow,
	argTypes: {
		color: {
			control: "color",
			description: "Color of the snowflakes",
		},
		flakeSize: {
			control: { type: "number", min: 0.001, max: 0.05, step: 0.001 },
			description: "Base size of each snowflake",
		},
		minFlakeSize: {
			control: { type: "number", min: 0.5, max: 3, step: 0.25 },
			description: "Minimum flake size based on depth",
		},
		pixelResolution: {
			control: { type: "number", min: 50, max: 500, step: 10 },
			description: "Pixel resolution of the effect (lower = more pixelated)",
		},
		speed: {
			control: { type: "number", min: 0.1, max: 5, step: 0.1 },
			description: "Speed of snow falling",
		},
		depthFade: {
			control: { type: "number", min: 1, max: 20, step: 1 },
			description: "How quickly flakes fade with depth",
		},
		farPlane: {
			control: { type: "number", min: 5, max: 50, step: 1 },
			description: "Maximum render distance",
		},
		brightness: {
			control: { type: "number", min: 0.1, max: 3, step: 0.1 },
			description: "Overall brightness multiplier",
		},
		gamma: {
			control: { type: "number", min: 0.1, max: 2, step: 0.05 },
			description: "Gamma correction value",
		},
		density: {
			control: { type: "number", min: 0.05, max: 1, step: 0.05 },
			description: "Density of snowflakes (probability per cell)",
		},
		variant: {
			control: { type: "select" },
			options: ["square", "round", "snowflake"],
			description: "Shape variant of the snowflakes",
		},
		direction: {
			control: { type: "number", min: 0, max: 360, step: 5 },
			description: "Wind direction in degrees",
		},
	},
	args: {
		color: "#ffffff",
		flakeSize: 0.01,
		minFlakeSize: 1.25,
		pixelResolution: 200,
		speed: 1.25,
		depthFade: 8,
		farPlane: 20,
		brightness: 1,
		gamma: 0.4545,
		density: 0.3,
		variant: "square",
		direction: 125,
	},
	decorators: [
		(Story) => (
			<div className="w-full h-[500px] relative overflow-hidden bg-black">
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof PixelSnow>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default pixel snow with square flakes falling diagonally. */
export const Default: Story = {};

/** Detailed snowflake shapes with slightly slower fall speed. */
export const Snowflakes: Story = {
	args: {
		variant: "snowflake",
		speed: 0.8,
	},
};

/** Dense blizzard effect with high density and fast speed. */
export const DenseBlizzard: Story = {
	args: {
		density: 0.6,
		speed: 2,
		brightness: 1.5,
	},
};
