import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import LiquidEther from "./liquid-ether";

/**
 * Interactive fluid simulation background with customizable colors and mouse-driven forces.
 * Uses Three.js. Source: ReactBits.
 */
const meta = {
	title: "Backgrounds/Liquid Ether",
	component: LiquidEther,
	argTypes: {
		mouseForce: {
			control: { type: "number", min: 1, max: 50, step: 1 },
			description: "Strength of the mouse-driven force applied to the fluid",
		},
		cursorSize: {
			control: { type: "number", min: 10, max: 300, step: 10 },
			description: "Radius of the cursor influence area in pixels",
		},
		colors: {
			control: "object",
			description: "Array of hex color strings for the fluid palette",
		},
		autoDemo: {
			control: "boolean",
			description: "Enable automatic animation when no user interaction",
		},
		autoSpeed: {
			control: { type: "number", min: 0.1, max: 3, step: 0.1 },
			description: "Speed of the automatic demo animation",
		},
		resolution: {
			control: { type: "number", min: 0.1, max: 1, step: 0.05 },
			description: "Simulation resolution scale (lower = faster, less detail)",
		},
	},
	args: {
		mouseForce: 20,
		cursorSize: 100,
		colors: ["#5227FF", "#FF9FFC", "#B19EEF"],
		autoDemo: true,
		autoSpeed: 0.5,
		resolution: 0.5,
	},
	decorators: [
		(Story) => (
			<div className="w-full h-[500px] relative overflow-hidden bg-black">
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof LiquidEther>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default purple fluid simulation with auto-demo enabled. */
export const Default: Story = {};

/** Warm color palette with orange, gold, and pink tones. */
export const WarmColors: Story = {
	args: {
		colors: ["#FF6B35", "#FFD700", "#FF1493"],
	},
};

/** High force with a large cursor for dramatic fluid movement. */
export const HighForce: Story = {
	args: {
		mouseForce: 40,
		cursorSize: 200,
	},
};

/** Auto-demo disabled — requires manual mouse interaction. */
export const NoAutoDemo: Story = {
	args: {
		autoDemo: false,
	},
};
