import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { FuzzyText } from "./fuzzy-text";

/**
 * Canvas-based text with a fuzzy glitch displacement effect on hover.
 * Rows of pixels shift randomly creating a static/glitch appearance.
 * Intensity increases on mouse hover. Source: Sera UI.
 */
const meta = {
	title: "Text Animations/Fuzzy Text",
	component: FuzzyText,
	tags: ["autodocs"],
	argTypes: {
		text: {
			control: "text",
			description: "The text to display",
		},
		fontSize: {
			control: "text",
			description: "CSS font size value",
		},
		fontWeight: {
			control: { type: "number", min: 100, max: 900, step: 100 },
			description: "Font weight (100-900)",
		},
		color: {
			control: "color",
			description: "Text color (hex)",
		},
		baseIntensity: {
			control: { type: "number", min: 0, max: 20, step: 0.5 },
			description: "Glitch intensity at rest",
		},
		hoverIntensity: {
			control: { type: "number", min: 0, max: 50, step: 1 },
			description: "Glitch intensity on hover",
		},
	},
	args: {
		text: "HOVER ME",
		fontSize: "clamp(3rem, 10vw, 8rem)",
		fontWeight: 700,
		color: "#33ffcc",
		baseIntensity: 1,
		hoverIntensity: 15,
	},
	decorators: [
		(Story) => (
			<div className="w-full flex items-center justify-center p-8">
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof FuzzyText>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default fuzzy text — hover to see increased glitch intensity. */
export const Default: Story = {};

/** Custom yellow color with high base intensity for always-on glitch. */
export const CustomColor: Story = {
	args: {
		text: "GLITCH",
		color: "#D7D00F",
		baseIntensity: 6,
		hoverIntensity: 20,
	},
};

/** Maximum intensity — chaotic displacement at all times. */
export const HighIntensity: Story = {
	args: {
		text: "CHAOS",
		color: "#ff3366",
		baseIntensity: 15,
		hoverIntensity: 40,
	},
};

/** Subtle effect with low base and hover intensities. */
export const Subtle: Story = {
	args: {
		text: "SUBTLE",
		color: "#6699ff",
		baseIntensity: 0.5,
		hoverIntensity: 5,
	},
};
