import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import Aurora from "./aurora";

/**
 * Animated aurora borealis background effect using WebGL shaders via OGL.
 * Renders simplex noise-driven color gradients with customizable color stops,
 * amplitude, blend, and speed. Requires `ogl` peer dependency. Source: ReactBits.
 */
const meta = {
	title: "Backgrounds/Aurora",
	component: Aurora,
	argTypes: {
		colorStops: {
			control: "object",
			description: "Array of 3 hex color strings for the gradient stops",
		},
		amplitude: {
			control: { type: "number", min: 0.1, max: 3, step: 0.1 },
			description: "Height/intensity of the aurora waves",
		},
		blend: {
			control: { type: "number", min: 0, max: 1, step: 0.05 },
			description: "Edge softness of the aurora (0 = hard, 1 = very soft)",
		},
		speed: {
			control: { type: "number", min: 0.1, max: 5, step: 0.1 },
			description: "Animation speed multiplier",
		},
	},
	args: {
		colorStops: ["#5227FF", "#7cff67", "#5227FF"],
		amplitude: 1.0,
		blend: 0.5,
		speed: 1.0,
	},
	decorators: [
		(Story) => (
			<div className="w-full h-[500px] relative overflow-hidden bg-black">
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof Aurora>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default purple-green aurora with medium amplitude. */
export const Default: Story = {};

/** Warm color palette with orange and red tones. */
export const WarmColors: Story = {
	args: {
		colorStops: ["#FF6B35", "#FFD700", "#FF1493"],
	},
};

/** Cool blue-cyan palette. */
export const CoolColors: Story = {
	args: {
		colorStops: ["#00BFFF", "#1E90FF", "#0000CD"],
	},
};

/** High amplitude creates dramatic, tall waves. */
export const HighAmplitude: Story = {
	args: {
		amplitude: 2.5,
		blend: 0.3,
	},
};

/** Slow, gentle aurora movement. */
export const SlowSpeed: Story = {
	args: {
		speed: 0.3,
		amplitude: 0.8,
	},
};
