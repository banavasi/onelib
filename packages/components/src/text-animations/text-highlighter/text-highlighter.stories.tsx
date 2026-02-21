import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { TextHighlighter } from "./text-highlighter";

/**
 * Scroll-triggered text highlight animation using IntersectionObserver.
 * Animates a gradient highlight behind text when scrolled into view.
 * Source: Sera UI.
 */
const meta = {
	title: "Text Animations/Text Highlighter",
	component: TextHighlighter,
	argTypes: {
		children: {
			control: "text",
			description: "Text content to highlight",
		},
		highlightColor: {
			control: "text",
			description: "CSS gradient or color for the highlight",
		},
		direction: {
			control: { type: "select" },
			options: ["ltr", "rtl"],
			description: "Direction of the highlight animation",
		},
		triggerOnScroll: {
			control: "boolean",
			description: "Whether to trigger on scroll into view",
		},
		threshold: {
			control: { type: "number", min: 0, max: 1, step: 0.1 },
			description: "IntersectionObserver threshold",
		},
		delay: {
			control: { type: "number", min: 0, max: 5, step: 0.1 },
			description: "Delay before highlight starts (seconds)",
		},
		duration: {
			control: { type: "number", min: 0.1, max: 3, step: 0.1 },
			description: "Highlight animation duration (seconds)",
		},
	},
	args: {
		children: "highlighted text",
		triggerOnScroll: true,
		threshold: 0.5,
		delay: 0,
		duration: 0.5,
		direction: "ltr",
	},
	decorators: [
		(Story) => (
			<div className="w-full h-[200px] flex items-center justify-center text-xl">
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof TextHighlighter>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default text highlighter with green gradient. */
export const Default: Story = {};

/** Right-to-left highlight animation. */
export const RTL: Story = {
	args: {
		children: "right-to-left highlight",
		direction: "rtl",
	},
};

/** Custom purple-blue gradient highlight. */
export const CustomColor: Story = {
	args: {
		children: "custom colored highlight",
		highlightColor: "linear-gradient(45deg, #3b82f6, #8b5cf6)",
	},
};
