import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import ColorBends from "./color-bends";

/**
 * Smooth organic color bending animation with customizable gradient colors,
 * rotation, warp strength, and mouse interaction. Uses Three.js WebGL shaders.
 * Requires `three` peer dependency. Source: ReactBits.
 */
const meta = {
	title: "Backgrounds/Color Bends",
	component: ColorBends,
	argTypes: {
		rotation: {
			control: { type: "number", min: 0, max: 360, step: 1 },
			description: "Initial rotation angle in degrees",
		},
		speed: {
			control: { type: "number", min: 0.05, max: 2, step: 0.05 },
			description: "Animation speed multiplier",
		},
		colors: {
			control: "object",
			description: "Array of hex color strings for the gradient",
		},
		scale: {
			control: { type: "number", min: 0.1, max: 5, step: 0.1 },
			description: "Scale of the pattern",
		},
		frequency: {
			control: { type: "number", min: 0.1, max: 5, step: 0.1 },
			description: "Frequency of the color wave pattern",
		},
		warpStrength: {
			control: { type: "number", min: 0, max: 5, step: 0.1 },
			description: "Strength of the warp distortion",
		},
		noise: {
			control: { type: "number", min: 0, max: 1, step: 0.01 },
			description: "Amount of noise grain overlay",
		},
	},
	args: {
		rotation: 45,
		speed: 0.2,
		colors: [],
		scale: 1,
		frequency: 1,
		warpStrength: 1,
		noise: 0.1,
	},
	decorators: [
		(Story) => (
			<div className="w-full h-[500px] relative overflow-hidden bg-black">
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof ColorBends>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default color bends with automatic rainbow gradient. */
export const Default: Story = {};

/** Custom warm color palette. */
export const CustomColors: Story = {
	args: {
		colors: ["#FF6B35", "#00BFFF", "#7CFF67"],
	},
};

/** Fast auto-rotation with higher speed. */
export const FastRotation: Story = {
	args: {
		speed: 0.8,
		autoRotate: 30,
	},
};

/** High warp distortion with increased frequency. */
export const HighWarp: Story = {
	args: {
		warpStrength: 3,
		frequency: 2,
	},
};
