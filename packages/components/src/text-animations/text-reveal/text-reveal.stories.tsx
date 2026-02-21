import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { TextReveal } from "./text-reveal";

/**
 * Word-by-word smoke reveal animation.
 * Each word fades in with a blur-to-sharp transition and upward slide.
 * Source: Sera UI.
 */
const meta = {
	title: "Text Animations/Text Reveal",
	component: TextReveal,
	argTypes: {
		text: {
			control: "text",
			description: "The text to reveal word by word",
		},
		className: {
			control: "text",
			description: "Additional CSS classes",
		},
	},
	args: {
		text: "Don't wait for the perfect moment. Take the moment and make it perfect.",
	},
	decorators: [
		(Story) => (
			<div className="w-full min-h-[200px] flex items-center justify-center">
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof TextReveal>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default text reveal with a motivational quote. */
export const Default: Story = {};

/** Short text with quick reveal. */
export const Short: Story = {
	args: {
		text: "Think different",
	},
};
