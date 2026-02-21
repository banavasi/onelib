import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { BlurInText } from "./text-animation";

/**
 * Character-by-character blur-in text animation.
 * Each character animates from blurred to sharp with staggered timing.
 * Source: Sera UI.
 */
const meta = {
	title: "Text Animations/Text Animation",
	component: BlurInText,
	argTypes: {
		text: {
			control: "text",
			description: "The text to animate",
		},
		delay: {
			control: { type: "number", min: 0, max: 2, step: 0.1 },
			description: "Initial delay before animation starts (seconds)",
		},
		duration: {
			control: { type: "number", min: 0.1, max: 2, step: 0.1 },
			description: "Duration of each character animation (seconds)",
		},
		className: {
			control: "text",
			description: "Additional CSS classes",
		},
	},
	args: {
		text: "Sharp Focus Ahead",
		delay: 0.2,
		duration: 0.5,
	},
	decorators: [
		(Story) => (
			<div className="w-full h-[200px] flex items-center justify-center">
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof BlurInText>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default blur-in text animation. */
export const Default: Story = {};

/** Long text with staggered character animation. */
export const LongText: Story = {
	args: {
		text: "Simplicity is the ultimate sophistication",
	},
};
