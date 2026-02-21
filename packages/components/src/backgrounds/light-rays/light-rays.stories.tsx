import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import LightRays from "./light-rays";

/**
 * Volumetric light ray effect with configurable origin, color, spread, and optional
 * mouse following. Uses OGL WebGL shaders. Requires `ogl` peer dependency.
 * Source: ReactBits.
 */
const meta = {
	title: "Backgrounds/Light Rays",
	component: LightRays,
	argTypes: {
		raysOrigin: {
			control: "select",
			options: [
				"top-left",
				"top-center",
				"top-right",
				"left",
				"right",
				"bottom-left",
				"bottom-center",
				"bottom-right",
			],
			description: "Origin point of the light rays",
		},
		raysColor: {
			control: "color",
			description: "Color of the light rays",
		},
		raysSpeed: {
			control: { type: "number", min: 0.1, max: 5, step: 0.1 },
			description: "Animation speed of the rays",
		},
		lightSpread: {
			control: { type: "number", min: 0.1, max: 5, step: 0.1 },
			description: "How wide the light rays spread",
		},
		rayLength: {
			control: { type: "number", min: 0.5, max: 5, step: 0.1 },
			description: "Length of the light rays",
		},
		pulsating: {
			control: "boolean",
			description: "Enable pulsating ray intensity",
		},
		followMouse: {
			control: "boolean",
			description: "Enable mouse following for ray direction",
		},
	},
	args: {
		raysOrigin: "top-center",
		raysColor: "#ffffff",
		raysSpeed: 1,
		lightSpread: 1,
		rayLength: 2,
	},
	decorators: [
		(Story) => (
			<div className="w-full h-[500px] relative overflow-hidden bg-black">
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof LightRays>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default white light rays from top center. */
export const Default: Story = {};

/** Warm orange rays from the bottom. */
export const BottomRays: Story = {
	args: {
		raysOrigin: "bottom-center",
		raysColor: "#FF6B35",
	},
};

/** Pulsating rays with slower speed. */
export const PulsatingRays: Story = {
	args: {
		pulsating: true,
		raysSpeed: 0.5,
	},
};

/** Wide spread rays with extended length. */
export const WideSpread: Story = {
	args: {
		lightSpread: 3,
		rayLength: 4,
	},
};
