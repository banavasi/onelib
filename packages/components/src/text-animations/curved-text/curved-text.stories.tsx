import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { CanvasCurvedLoop } from "./curved-text";

/**
 * Canvas-based curved scrolling text with configurable direction, speed, and curve.
 * Renders text along a sine-like curve with optional mouse interaction.
 * Source: Sera UI.
 */
const meta = {
	title: "Text Animations/Curved Text",
	component: CanvasCurvedLoop,
	argTypes: {
		text: {
			control: "text",
			description: "Text to display along the curve",
		},
		speed: {
			control: { type: "number", min: 0.1, max: 10, step: 0.1 },
			description: "Scroll speed",
		},
		curveHeight: {
			control: { type: "number", min: 0, max: 200, step: 10 },
			description: "Height of the curve in pixels",
		},
		direction: {
			control: { type: "select" },
			options: ["left", "right"],
			description: "Scroll direction",
		},
		interactive: {
			control: "boolean",
			description: "Enable mouse interaction",
		},
		fontSize: {
			control: { type: "number", min: 12, max: 120, step: 4 },
			description: "Font size in pixels",
		},
		fontFamily: {
			control: "text",
			description: "CSS font family",
		},
		fontWeight: {
			control: "text",
			description: "CSS font weight",
		},
		height: {
			control: { type: "number", min: 50, max: 500, step: 10 },
			description: "Canvas height in pixels",
		},
		gap: {
			control: { type: "number", min: 0, max: 200, step: 10 },
			description: "Gap between text repetitions",
		},
		easing: {
			control: { type: "select" },
			options: ["linear", "easeIn", "easeOut", "easeInOut"],
			description: "Curve easing function",
		},
	},
	args: {
		text: "A helpful UI library for design engineers. Use cool animations with just a copy and paste.",
		speed: 1,
		curveHeight: 40,
		direction: "left",
		interactive: true,
		fontSize: 48,
		fontFamily: "sans-serif",
		fontWeight: "bold",
		height: 200,
		gap: 50,
		easing: "linear",
	},
	decorators: [
		(Story) => (
			<div className="w-full text-white">
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof CanvasCurvedLoop>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default curved text scrolling left. */
export const Default: Story = {};

/** Right-direction scrolling at double speed. */
export const RightDirection: Story = {
	args: {
		direction: "right",
		speed: 2,
	},
};

/** Large text with extra curve height. */
export const LargeText: Story = {
	args: {
		fontSize: 80,
		curveHeight: 80,
	},
};
