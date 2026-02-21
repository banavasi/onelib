import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import GlowLine from "./glow-line";

/**
 * A decorative horizontal or vertical glow line with layered gradient effects.
 * Supports purple, blue, green, and red color schemes. Source: Sera UI.
 */
const meta = {
	title: "Effects/Glow Line",
	component: GlowLine,
	decorators: [
		(Story) => (
			<div className="w-full h-[400px] relative overflow-hidden bg-gray-950">
				<Story />
			</div>
		),
	],
	argTypes: {
		orientation: {
			control: "select",
			options: ["horizontal", "vertical"],
			description: "Line orientation",
		},
		position: {
			control: "text",
			description: "CSS position value (e.g. '50%', '200px')",
		},
		color: {
			control: "select",
			options: ["purple", "blue", "green", "red"],
			description: "Glow color scheme",
		},
	},
	args: {
		orientation: "horizontal",
		position: "50%",
		color: "blue",
	},
} satisfies Meta<typeof GlowLine>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default horizontal blue glow line centered vertically. */
export const Default: Story = {};

/** Vertical purple glow line centered horizontally. */
export const VerticalLine: Story = {
	args: {
		orientation: "vertical",
		position: "50%",
		color: "purple",
	},
};

/** Multiple glow lines in different positions and colors forming a grid-like pattern. */
export const MultipleLines: Story = {
	render: () => (
		<>
			<GlowLine orientation="horizontal" position="30%" color="purple" />
			<GlowLine orientation="horizontal" position="70%" color="blue" />
			<GlowLine orientation="vertical" position="25%" color="green" />
			<GlowLine orientation="vertical" position="75%" color="red" />
		</>
	),
};

/** All color variants as horizontal lines. */
export const AllColors: Story = {
	render: () => (
		<>
			<GlowLine orientation="horizontal" position="20%" color="purple" />
			<GlowLine orientation="horizontal" position="40%" color="blue" />
			<GlowLine orientation="horizontal" position="60%" color="green" />
			<GlowLine orientation="horizontal" position="80%" color="red" />
		</>
	),
};
