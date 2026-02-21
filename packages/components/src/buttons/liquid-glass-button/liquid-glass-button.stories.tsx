import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import GlassButton from "./liquid-glass-button";

/**
 * Apple-style liquid glass button with SVG displacement map distortion filter.
 * Supports subtle, default, bold, and ghost presets with size variants.
 * Source: Sera UI.
 */
const meta = {
	title: "Buttons/Liquid Glass Button",
	component: GlassButton,
	decorators: [
		(Story) => (
			<div
				className="w-full h-[400px] relative overflow-hidden flex items-center justify-center"
				style={{
					backgroundImage:
						"url('https://images.unsplash.com/photo-1744125156184-e0d7e0bc04c4?q=80&w=687&auto=format&fit=crop')",
					backgroundSize: "cover",
					backgroundPosition: "center",
				}}
			>
				<Story />
			</div>
		),
	],
	argTypes: {
		variant: {
			control: "select",
			options: ["subtle", "default", "bold", "ghost"],
			description: "Glass preset variant",
		},
		size: {
			control: "select",
			options: ["sm", "md", "lg", "icon"],
			description: "Button size",
		},
		children: {
			control: "text",
			description: "Button label text",
		},
	},
	args: {
		children: "Glass Button",
		variant: "default",
		size: "md",
	},
} satisfies Meta<typeof GlassButton>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default glass button with standard blur and saturation. */
export const Default: Story = {};

/** Subtle variant with minimal glass effect. */
export const SubtleVariant: Story = {
	args: {
		variant: "subtle",
		children: "Subtle Glass",
	},
};

/** Bold variant with maximum glass intensity. */
export const BoldVariant: Story = {
	args: {
		variant: "bold",
		children: "Bold Glass",
	},
};

/** Ghost variant with near-transparent glass effect. */
export const GhostVariant: Story = {
	args: {
		variant: "ghost",
		children: "Ghost Glass",
	},
};

/** Icon-sized square glass button. */
export const IconButton: Story = {
	args: {
		size: "icon",
		children: (
			<svg
				width="20"
				height="20"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
			>
				<path d="M12 5v14M5 12h14" />
			</svg>
		),
	},
};

/** All size variants together. */
export const AllSizes: Story = {
	render: () => (
		<div className="flex items-center gap-4">
			<GlassButton size="sm">Small</GlassButton>
			<GlassButton size="md">Medium</GlassButton>
			<GlassButton size="lg">Large</GlassButton>
			<GlassButton size="icon">
				<svg
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
				>
					<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
				</svg>
			</GlassButton>
		</div>
	),
};
