import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import NoiseCard from "./noise-card";

/**
 * A card component with animated canvas noise texture overlay.
 * Supports customizable grain size, opacity, animation, and background color.
 * Source: Sera UI.
 */
const meta = {
	title: "Cards/Noise Card",
	component: NoiseCard,
	argTypes: {
		bgColor: {
			control: "text",
			description: "Tailwind background color class",
		},
		noiseOpacity: {
			control: { type: "range", min: 0, max: 1, step: 0.05 },
			description: "Opacity of the noise overlay",
		},
		grainSize: {
			control: { type: "number", min: 1, max: 10, step: 1 },
			description: "Size of the noise grain pixels",
		},
		animated: {
			control: "boolean",
			description: "Whether the noise animates continuously",
		},
		width: {
			control: "text",
			description: "Tailwind width class",
		},
		height: {
			control: "text",
			description: "Tailwind height class",
		},
	},
	decorators: [
		(Story) => (
			<div className="w-full min-h-[400px] flex items-center justify-center bg-gray-900 p-6">
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof NoiseCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default noise card with blue background and animated noise. */
export const Default: Story = {
	args: {
		bgColor: "bg-[#0014FF]",
		children: (
			<>
				<h3 className="text-xl font-bold mb-2">Deep Ocean</h3>
				<p className="text-sm opacity-80">A card with animated noise texture overlay</p>
			</>
		),
	},
};

/** Purple variant with noise texture. */
export const PurpleCard: Story = {
	args: {
		bgColor: "bg-purple-700",
		children: (
			<>
				<h3 className="text-xl font-bold mb-2">Purple Haze</h3>
				<p className="text-sm opacity-80">Rich purple with grain texture</p>
			</>
		),
	},
};

/** Static noise (non-animated) for reduced motion preference. */
export const StaticNoise: Story = {
	args: {
		animated: false,
		bgColor: "bg-gray-800",
		children: (
			<>
				<h3 className="text-xl font-bold mb-2">Static Grain</h3>
				<p className="text-sm opacity-80">Non-animated noise overlay</p>
			</>
		),
	},
};
