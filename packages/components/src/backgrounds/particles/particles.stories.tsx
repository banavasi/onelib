import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import Particles from "./particles";

/**
 * 3D particle system with customizable colors, density, and optional hover interaction.
 * Uses OGL WebGL renderer. Source: ReactBits.
 */
const meta = {
	title: "Backgrounds/Particles",
	component: Particles,
	argTypes: {
		particleCount: {
			control: { type: "number", min: 50, max: 1000, step: 10 },
			description: "Total number of particles rendered",
		},
		particleSpread: {
			control: { type: "number", min: 1, max: 20, step: 0.5 },
			description: "Spread radius of the particle cloud",
		},
		speed: {
			control: { type: "number", min: 0.01, max: 1, step: 0.01 },
			description: "Animation speed multiplier",
		},
		particleColors: {
			control: "object",
			description: "Array of hex color strings for particle colors",
		},
		moveParticlesOnHover: {
			control: "boolean",
			description: "Whether particles react to mouse hover",
		},
		alphaParticles: {
			control: "boolean",
			description: "Enable soft alpha-blended particles instead of hard circles",
		},
		particleBaseSize: {
			control: { type: "number", min: 10, max: 300, step: 5 },
			description: "Base size of each particle in pixels",
		},
		sizeRandomness: {
			control: { type: "number", min: 0, max: 2, step: 0.1 },
			description: "Randomness factor for particle sizes (0 = uniform)",
		},
		cameraDistance: {
			control: { type: "number", min: 5, max: 50, step: 1 },
			description: "Distance of the camera from the particle cloud",
		},
		disableRotation: {
			control: "boolean",
			description: "Disable the automatic rotation of the particle cloud",
		},
	},
	args: {
		particleCount: 200,
		particleSpread: 10,
		speed: 0.1,
		particleColors: ["#ffffff", "#ffffff", "#ffffff"],
		particleBaseSize: 100,
		sizeRandomness: 1,
		cameraDistance: 20,
	},
	decorators: [
		(Story) => (
			<div className="w-full h-[500px] relative overflow-hidden bg-black">
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof Particles>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default white particle cloud with medium density. */
export const Default: Story = {};

/** Colorful particles using orange, cyan, and green. */
export const ColorfulParticles: Story = {
	args: {
		particleColors: ["#FF6B35", "#00BFFF", "#7CFF67"],
	},
};

/** Dense particle cloud with tighter spread. */
export const DenseCloud: Story = {
	args: {
		particleCount: 500,
		particleSpread: 5,
	},
};

/** Interactive particles that follow the mouse cursor. */
export const InteractiveHover: Story = {
	args: {
		moveParticlesOnHover: true,
		particleHoverFactor: 2,
	},
};
