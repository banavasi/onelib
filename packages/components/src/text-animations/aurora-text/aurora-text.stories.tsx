import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { AuroraText } from "./aurora-text";

/**
 * Gradient animated text with flowing aurora color effect.
 * Uses CSS keyframes for smooth color transitions.
 * Source: Sera UI.
 */
const meta = {
	title: "Text Animations/Aurora Text",
	component: AuroraText,
	argTypes: {
		children: {
			control: "text",
			description: "Text content to display",
		},
		colors: {
			control: "object",
			description: "Array of gradient colors",
		},
		speed: {
			control: { type: "number", min: 1, max: 20, step: 1 },
			description: "Animation speed in seconds",
		},
		className: {
			control: "text",
			description: "Additional CSS classes",
		},
	},
	args: {
		children: "Beautiful",
		colors: ["#FF0080", "#7928CA", "#0070F3", "#38bdf8"],
		speed: 5,
	},
	decorators: [
		(Story) => (
			<div className="w-full h-[200px] flex items-center justify-center text-6xl font-bold">
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof AuroraText>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default aurora text with pink-purple-blue gradient. */
export const Default: Story = {};

/** Custom three-color gradient with pink, purple, and blue. */
export const CustomColors: Story = {
	args: {
		children: "Custom",
		colors: ["#FF0080", "#7928CA", "#0070F3"],
	},
};

/** Fast animation cycle at 3 seconds. */
export const FastAnimation: Story = {
	args: {
		children: "Fast",
		speed: 3,
	},
};
