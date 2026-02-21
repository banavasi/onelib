import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { Testimonial } from "./testimonial";

/**
 * Testimonial section with featured quote, star ratings, and clickable grid
 * of customer testimonials. Self-contained with hardcoded data. Source: Sera UI.
 */
const meta = {
	title: "Sections/Testimonial",
	component: Testimonial,
	parameters: {
		layout: "fullscreen",
	},
	decorators: [
		(Story) => (
			<div className="w-full">
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof Testimonial>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default testimonial section with featured quote and clickable grid. */
export const Default: Story = {};
