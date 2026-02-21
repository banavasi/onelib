import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { DecryptingText } from "./decrypting-text";

/**
 * Text reveal animation that scrambles characters before decoding to the target text.
 * Characters cycle through random symbols before settling into final positions.
 * Uses motion for fade-in opacity animation. Source: Sera UI.
 */
const meta = {
	title: "Text Animations/Decrypting Text",
	component: DecryptingText,
	argTypes: {
		targetText: {
			control: "text",
			description: "The text to reveal through decryption animation",
		},
		speed: {
			control: { type: "number", min: 1, max: 20, step: 1 },
			description: "Decryption speed (higher = slower reveal)",
		},
		className: {
			control: "text",
			description: "Custom CSS class for styling",
		},
	},
	args: {
		targetText: "In silence wakes the sleeping code",
		speed: 8,
	},
	decorators: [
		(Story) => (
			<div className="w-full flex items-center justify-center p-8 font-mono">
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof DecryptingText>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default decryption animation — characters scramble then reveal. */
export const Default: Story = {};

/** Slow decryption with reduced speed for dramatic reveal. */
export const SlowDecode: Story = {
	args: {
		targetText: "A whisper through the circuit flowed",
		speed: 3,
	},
};

/** Fast decryption that resolves almost instantly. */
export const FastDecode: Story = {
	args: {
		targetText: "Decrypted in a flash",
		speed: 15,
	},
};

/** Custom styled text with a different CSS class. */
export const CustomStyle: Story = {
	args: {
		targetText: "Custom styling applied",
		className: "text-4xl font-bold text-center text-cyan-400",
	},
};

/** Multiple lines displayed together (re-mount to replay animation). */
export const MultiLine: Story = {
	render: () => (
		<div className="flex flex-col items-center gap-2">
			<DecryptingText targetText="First line decrypting..." speed={3} />
			<DecryptingText targetText="Second line follows behind" speed={3} />
			<DecryptingText targetText="Third line arrives last" speed={3} />
		</div>
	),
};
