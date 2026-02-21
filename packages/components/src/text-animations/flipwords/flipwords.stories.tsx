import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { FlipWords } from "./flipwords";

/**
 * Animated word rotator that cycles through a list of words
 * with blur and slide transitions. Source: Sera UI.
 */
const meta = {
	title: "Text Animations/Flip Words",
	component: FlipWords,
	argTypes: {
		words: {
			control: "object",
			description: "Array of words to cycle through",
		},
		duration: {
			control: { type: "number", min: 500, max: 10000, step: 500 },
			description: "Duration between word changes (ms)",
		},
		className: {
			control: "text",
			description: "Additional CSS classes",
		},
	},
	args: {
		words: ["creating", "building", "designing", "crafting"],
		duration: 3000,
	},
	decorators: [
		(Story) => (
			<div className="w-full h-[200px] flex items-center justify-center text-4xl font-bold">
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof FlipWords>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default flip words animation cycling through creative verbs. */
export const Default: Story = {};

/** Fast word rotation with 1.5 second intervals. */
export const FastRotation: Story = {
	args: {
		duration: 1500,
	},
};
