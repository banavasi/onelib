import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { ShimmerButton } from "./shimmer-button";

/**
 * A button with an animated conic-gradient shimmer border effect.
 * The shimmer continuously rotates around the button edge. Source: Sera UI.
 */
const meta = {
	title: "Buttons/Shimmer Button",
	component: ShimmerButton,
	argTypes: {
		children: {
			control: "text",
			description: "Button label text",
		},
	},
	args: {
		children: "Shimmer Button",
	},
} satisfies Meta<typeof ShimmerButton>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default shimmer button with rotating conic gradient border. */
export const Default: Story = {};

/** Shimmer button with custom text content. */
export const CustomText: Story = {
	args: {
		children: "Get Started Free",
	},
};

/** Multiple shimmer buttons shown together. */
export const Group: Story = {
	render: () => (
		<div className="flex flex-col items-center gap-6">
			<ShimmerButton>Sign Up Now</ShimmerButton>
			<ShimmerButton>Learn More</ShimmerButton>
			<ShimmerButton>Contact Sales</ShimmerButton>
		</div>
	),
};
