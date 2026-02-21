import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import Prism from "./prism";

/**
 * Animated 3D prism/pyramid effect with rotation, hover interaction, and color customization.
 * Uses OGL WebGL shaders. Source: ReactBits.
 */
const meta = {
	title: "Backgrounds/Prism",
	component: Prism,
	argTypes: {
		height: {
			control: { type: "number", min: 0.5, max: 10, step: 0.1 },
			description: "Height of the prism shape",
		},
		baseWidth: {
			control: { type: "number", min: 1, max: 10, step: 0.1 },
			description: "Base width of the prism shape",
		},
		animationType: {
			control: "select",
			options: ["rotate", "hover", "3drotate"],
			description: "Type of animation applied to the prism",
		},
		glow: {
			control: { type: "number", min: 0, max: 5, step: 0.1 },
			description: "Glow intensity of the prism edges",
		},
		noise: {
			control: { type: "number", min: 0, max: 2, step: 0.05 },
			description: "Film grain noise intensity",
		},
		scale: {
			control: { type: "number", min: 1, max: 10, step: 0.1 },
			description: "Overall zoom scale of the prism scene",
		},
		hueShift: {
			control: { type: "number", min: 0, max: 6.28, step: 0.01 },
			description: "Hue rotation in radians applied to the output colors",
		},
		bloom: {
			control: { type: "number", min: 0, max: 3, step: 0.1 },
			description: "Bloom intensity for the glow effect",
		},
		timeScale: {
			control: { type: "number", min: 0, max: 2, step: 0.05 },
			description: "Speed multiplier for the animation",
		},
	},
	args: {
		height: 3.5,
		baseWidth: 5.5,
		animationType: "rotate",
		glow: 1,
		noise: 0.5,
		scale: 3.6,
		bloom: 1,
		timeScale: 0.5,
	},
	decorators: [
		(Story) => (
			<div className="w-full h-[500px] relative overflow-hidden bg-black">
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof Prism>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default rotating prism with balanced glow and bloom. */
export const Default: Story = {};

/** Hover-interactive prism that follows the mouse cursor. */
export const HoverInteractive: Story = {
	args: {
		animationType: "hover",
		hoverStrength: 3,
	},
};

/** Full 3D rotation with faster animation speed. */
export const FullRotation: Story = {
	args: {
		animationType: "3drotate",
		timeScale: 1,
	},
};

/** Hue-shifted prism with enhanced glow and bloom. */
export const HueShifted: Story = {
	args: {
		hueShift: 2.0,
		glow: 2,
		bloom: 2,
	},
};
