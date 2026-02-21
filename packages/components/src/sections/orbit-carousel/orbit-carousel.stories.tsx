import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { OrbitCarousel } from "./orbit-carousel";

/**
 * 3D orbital carousel with smooth spring transitions between team member cards.
 * Features orbit visualization, animated info cards, and dot navigation.
 * Requires `motion` peer dependency. Source: Sera UI.
 */
const meta = {
	title: "Sections/Orbit Carousel",
	component: OrbitCarousel,
	parameters: {
		layout: "centered",
	},
	decorators: [
		(Story) => (
			<div className="w-full min-h-[500px] flex items-center justify-center">
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof OrbitCarousel>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default orbit carousel with team member cards. */
export const Default: Story = {};
