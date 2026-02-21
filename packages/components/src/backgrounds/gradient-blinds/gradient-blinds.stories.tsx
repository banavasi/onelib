import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import GradientBlinds from "./gradient-blinds";

/**
 * Gradient blinds effect with spotlight tracking, customizable gradient colors,
 * and distortion. Uses OGL WebGL shaders. Requires `ogl` peer dependency.
 * Source: ReactBits.
 */
const meta = {
	title: "Backgrounds/Gradient Blinds",
	component: GradientBlinds,
	argTypes: {
		gradientColors: {
			control: "object",
			description: "Array of hex color strings for the gradient",
		},
		blindCount: {
			control: { type: "number", min: 1, max: 64, step: 1 },
			description: "Number of blinds (vertical stripes)",
		},
		noise: {
			control: { type: "number", min: 0, max: 1, step: 0.05 },
			description: "Amount of noise grain overlay",
		},
		angle: {
			control: { type: "number", min: -180, max: 180, step: 1 },
			description: "Rotation angle of the blinds in degrees",
		},
		mirrorGradient: {
			control: "boolean",
			description: "Mirror the gradient for a symmetric pattern",
		},
		distortAmount: {
			control: { type: "number", min: 0, max: 5, step: 0.1 },
			description: "Amount of wave distortion applied to blinds",
		},
		spotlightRadius: {
			control: { type: "number", min: 0.1, max: 2, step: 0.05 },
			description: "Radius of the mouse spotlight effect",
		},
	},
	args: {
		gradientColors: ["#FF9FFC", "#5227FF"],
		blindCount: 16,
		noise: 0.3,
		angle: 0,
	},
	decorators: [
		(Story) => (
			<div className="w-full h-[500px] relative overflow-hidden bg-black">
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof GradientBlinds>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default gradient blinds with purple-pink gradient. */
export const Default: Story = {};

/** Warm gradient with orange, gold, and pink tones. */
export const WarmGradient: Story = {
	args: {
		gradientColors: ["#FF6B35", "#FFD700", "#FF1493"],
	},
};

/** Mirrored gradient with three-color palette. */
export const MirroredGradient: Story = {
	args: {
		mirrorGradient: true,
		gradientColors: ["#00BFFF", "#7CFF67", "#FF1493"],
	},
};

/** High distortion with more blinds. */
export const DistortedBlinds: Story = {
	args: {
		distortAmount: 2,
		blindCount: 24,
	},
};
