import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { HeroSection } from "./hero";

/**
 * Complete hero section with integrated navbar, mobile menu, gradient background,
 * CTA buttons, and stats. Self-contained with inline SVG icons. Source: Sera UI.
 */
const meta = {
	title: "Sections/Hero",
	component: HeroSection,
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
} satisfies Meta<typeof HeroSection>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default hero section with navbar, gradient heading, CTA, and stats. */
export const Default: Story = {};
