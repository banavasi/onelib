import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import FloatingLines from "./floating-lines";

/**
 * Animated floating wave lines with customizable gradient colors, mouse interaction,
 * and parallax. Uses Three.js WebGL shaders. Requires `three` peer dependency.
 * Source: ReactBits.
 */
const meta = {
	title: "Backgrounds/Floating Lines",
	component: FloatingLines,
	argTypes: {
		animationSpeed: {
			control: { type: "number", min: 0.1, max: 3, step: 0.1 },
			description: "Speed multiplier for the wave animation",
		},
		interactive: {
			control: "boolean",
			description: "Enable mouse interaction to bend wave lines",
		},
		parallax: {
			control: "boolean",
			description: "Enable parallax effect on mouse movement",
		},
		linesGradient: {
			control: "object",
			description: "Array of hex color strings for the line gradient",
		},
		bendStrength: {
			control: { type: "number", min: -2, max: 2, step: 0.1 },
			description: "Strength of the mouse bend effect on lines",
		},
	},
	args: {
		animationSpeed: 1,
		interactive: true,
		parallax: true,
		linesGradient: ["#FF9FFC", "#5227FF", "#7CFF67"],
	},
	decorators: [
		(Story) => (
			<div className="w-full h-[500px] relative overflow-hidden bg-black">
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof FloatingLines>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default floating lines with purple-green gradient. */
export const Default: Story = {};

/** Warm gradient with orange, gold, and pink tones. */
export const WarmGradient: Story = {
	args: {
		linesGradient: ["#FF6B35", "#FFD700", "#FF1493"],
	},
};

/** Static lines without mouse interaction or parallax. */
export const NoInteraction: Story = {
	args: {
		interactive: false,
		parallax: false,
	},
};

/** Slow, gentle wave movement. */
export const SlowWaves: Story = {
	args: {
		animationSpeed: 0.3,
	},
};
