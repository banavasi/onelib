import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import LightPillar from "./light-pillar";

/**
 * Volumetric light pillar effect with customizable colors, glow, and rotation.
 * Uses Three.js WebGL shaders. Source: ReactBits.
 */
const meta = {
	title: "Backgrounds/Light Pillar",
	component: LightPillar,
	argTypes: {
		topColor: {
			control: "color",
			description: "Color at the top of the light pillar gradient",
		},
		bottomColor: {
			control: "color",
			description: "Color at the bottom of the light pillar gradient",
		},
		intensity: {
			control: { type: "number", min: 0.1, max: 3, step: 0.1 },
			description: "Overall brightness intensity of the pillar",
		},
		rotationSpeed: {
			control: { type: "number", min: 0, max: 2, step: 0.05 },
			description: "Speed of the pillar rotation animation",
		},
		interactive: {
			control: "boolean",
			description: "Whether the pillar reacts to mouse movement",
		},
		glowAmount: {
			control: { type: "number", min: 0.001, max: 0.02, step: 0.001 },
			description: "Amount of glow applied to the pillar edges",
		},
		pillarWidth: {
			control: { type: "number", min: 0.5, max: 10, step: 0.1 },
			description: "Width of the volumetric light pillar",
		},
		pillarHeight: {
			control: { type: "number", min: 0.1, max: 2, step: 0.05 },
			description: "Height scale of the pillar pattern",
		},
		noiseIntensity: {
			control: { type: "number", min: 0, max: 1, step: 0.05 },
			description: "Intensity of the dithering noise overlay",
		},
		pillarRotation: {
			control: { type: "number", min: 0, max: 360, step: 1 },
			description: "Static rotation angle of the pillar in degrees",
		},
	},
	args: {
		topColor: "#5227FF",
		bottomColor: "#FF9FFC",
		intensity: 1.0,
		rotationSpeed: 0.3,
		glowAmount: 0.005,
		pillarWidth: 3.0,
		pillarHeight: 0.4,
		noiseIntensity: 0.5,
	},
	decorators: [
		(Story) => (
			<div className="w-full h-[500px] relative overflow-hidden bg-black">
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof LightPillar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default purple-to-pink light pillar with moderate rotation. */
export const Default: Story = {};

/** Green-tinted pillar with dark green base. */
export const GreenPillar: Story = {
	args: {
		topColor: "#00FF88",
		bottomColor: "#004400",
	},
};

/** Wide pillar with increased glow and brightness. */
export const WideGlow: Story = {
	args: {
		pillarWidth: 8,
		glowAmount: 0.01,
		intensity: 1.5,
	},
};

/** Slow rotation with a 45-degree static tilt. */
export const SlowRotation: Story = {
	args: {
		rotationSpeed: 0.1,
		pillarRotation: 45,
	},
};
