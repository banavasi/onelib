import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import GradientAccordion from "./gradient-accordion";

const sampleItems = [
	{ question: "What are the key features of React?", answer: "React's key features include its component-based architecture, virtual DOM for performance, JSX for templating, and one-way data flow." },
	{ question: "How does Tailwind CSS improve development speed?", answer: "Tailwind CSS accelerates development by providing a vast library of utility classes that can be applied directly in your HTML." },
	{ question: "What are best practices for accessibility?", answer: "Best practices include using semantic HTML, providing text alternatives for images, ensuring sufficient color contrast, and enabling keyboard navigation." },
];

/**
 * Self-contained accordion items with a cyan-to-pink gradient border.
 * Each item manages its own open/close state independently.
 * Source: Sera UI.
 */
const meta = {
	title: "Accordions/Gradient Accordion",
	component: GradientAccordion,
	args: {
		items: sampleItems,
	},
	decorators: [
		(Story) => (
			<div className="w-full max-w-2xl mx-auto p-6">
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof GradientAccordion>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default gradient accordion with sample FAQ items. */
export const Default: Story = {};
