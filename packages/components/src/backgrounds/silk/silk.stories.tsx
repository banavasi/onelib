import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { Silk } from "./silk";

/**
 * Animated silk fabric background effect using Three.js GLSL shaders.
 * Renders flowing, organic patterns with customizable color, speed, scale,
 * noise, and rotation. Requires `three` and `@react-three/fiber`. Source: ReactBits.
 */
const meta = {
	title: "Backgrounds/Silk",
	component: Silk,
	tags: ["autodocs"],
	argTypes: {
		speed: {
			control: { type: "number", min: 0.5, max: 20, step: 0.5 },
			description: "Animation speed of the silk flow",
		},
		scale: {
			control: { type: "number", min: 0.5, max: 5, step: 0.1 },
			description: "Scale of the pattern texture",
		},
		color: {
			control: "color",
			description: "Base color of the silk pattern (hex)",
		},
		noiseIntensity: {
			control: { type: "number", min: 0, max: 5, step: 0.1 },
			description: "Intensity of the noise grain overlay",
		},
		rotation: {
			control: { type: "number", min: 0, max: 6.28, step: 0.1 },
			description: "Rotation angle of the pattern in radians",
		},
	},
	args: {
		speed: 5,
		scale: 1,
		color: "#7B7481",
		noiseIntensity: 1.5,
		rotation: 0,
	},
	decorators: [
		(Story) => (
			<div className="w-full h-[500px] relative rounded-lg overflow-hidden">
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof Silk>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default grey-purple silk pattern with moderate speed. */
export const Default: Story = {};

/** Deep blue silk with high speed. */
export const OceanSilk: Story = {
	args: {
		color: "#1a237e",
		speed: 10,
		noiseIntensity: 0.5,
	},
};

/** Warm golden silk with low noise for a cleaner look. */
export const GoldenSilk: Story = {
	args: {
		color: "#b8860b",
		speed: 3,
		noiseIntensity: 0.3,
		scale: 1.5,
	},
};

/** Rotated pattern creating diagonal flow. */
export const DiagonalFlow: Story = {
	args: {
		rotation: 0.785,
		speed: 7,
		color: "#4a148c",
	},
};

/** High scale zoomed-in pattern revealing fine detail. */
export const ZoomedIn: Story = {
	args: {
		scale: 3,
		speed: 2,
		noiseIntensity: 2,
	},
};
