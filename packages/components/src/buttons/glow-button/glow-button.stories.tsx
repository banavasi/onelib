import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import GlowButton from "./glow-button";

/**
 * A glowing button with blue, pink, and green color variants that adapt
 * to light/dark mode. Includes hover scale and glow intensity transitions.
 * Source: Sera UI.
 */
const meta = {
	title: "Buttons/Glow Button",
	component: GlowButton,
	argTypes: {
		variant: {
			control: "select",
			options: ["blue", "pink", "green"],
			description: "Color variant",
		},
		children: {
			control: "text",
			description: "Button label text",
		},
	},
	args: {
		children: "Glow Button",
		variant: "blue",
	},
} satisfies Meta<typeof GlowButton>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default blue glow button. */
export const Default: Story = {};

/** Pink variant with warm glow effect. */
export const PinkVariant: Story = {
	args: {
		variant: "pink",
		children: "Pink Glow",
	},
};

/** Green variant with nature-inspired glow. */
export const GreenVariant: Story = {
	args: {
		variant: "green",
		children: "Green Glow",
	},
};

/** All three variants side by side. */
export const AllVariants: Story = {
	render: () => (
		<div className="flex flex-wrap items-center gap-8">
			<GlowButton variant="blue">Blue Glow</GlowButton>
			<GlowButton variant="pink">Pink Glow</GlowButton>
			<GlowButton variant="green">Green Glow</GlowButton>
		</div>
	),
};
