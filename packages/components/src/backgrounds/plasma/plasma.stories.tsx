import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import Plasma from "./plasma";

/**
 * Animated plasma effect with customizable color, direction, and mouse interaction.
 * Uses OGL WebGL2 shaders. Source: ReactBits.
 */
const meta = {
	title: "Backgrounds/Plasma",
	component: Plasma,
	argTypes: {
		color: {
			control: "color",
			description: "Base color tint applied to the plasma effect",
		},
		speed: {
			control: { type: "number", min: 0.1, max: 5, step: 0.1 },
			description: "Animation speed multiplier",
		},
		direction: {
			control: "select",
			options: ["forward", "reverse", "pingpong"],
			description: "Direction of the plasma animation flow",
		},
		scale: {
			control: { type: "number", min: 0.5, max: 3, step: 0.1 },
			description: "Zoom scale of the plasma pattern",
		},
		opacity: {
			control: { type: "number", min: 0, max: 1, step: 0.05 },
			description: "Overall opacity of the plasma effect",
		},
		mouseInteractive: {
			control: "boolean",
			description: "Whether the plasma reacts to mouse movement",
		},
	},
	args: {
		color: "#ffffff",
		speed: 1,
		direction: "forward",
		scale: 1,
		opacity: 1,
		mouseInteractive: true,
	},
	decorators: [
		(Story) => (
			<div className="w-full h-[500px] relative overflow-hidden bg-black">
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof Plasma>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default white plasma with forward animation. */
export const Default: Story = {};

/** Purple-tinted plasma with slower animation. */
export const PurplePlasma: Story = {
	args: {
		color: "#8B5CF6",
		speed: 0.5,
	},
};

/** Fast reverse-direction plasma animation. */
export const FastReverse: Story = {
	args: {
		direction: "reverse",
		speed: 3,
	},
};

/** Ping-pong direction with moderate speed. */
export const PingPong: Story = {
	args: {
		direction: "pingpong",
		speed: 1.5,
	},
};
