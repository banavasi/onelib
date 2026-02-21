import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import DarkVeil from "./dark-veil";

/**
 * Neural network-generated dark background with optional hue shift, scanlines, noise,
 * and warp effects. Uses OGL shaders. Source: ReactBits.
 */
const meta = {
	title: "Backgrounds/Dark Veil",
	component: DarkVeil,
	argTypes: {
		hueShift: {
			control: { type: "number", min: 0, max: 360, step: 1 },
			description: "Hue rotation in degrees applied to the output colors",
		},
		noiseIntensity: {
			control: { type: "number", min: 0, max: 1, step: 0.01 },
			description: "Intensity of the film grain noise overlay",
		},
		scanlineIntensity: {
			control: { type: "number", min: 0, max: 1, step: 0.01 },
			description: "Intensity of the CRT scanline effect",
		},
		speed: {
			control: { type: "number", min: 0.1, max: 2, step: 0.05 },
			description: "Animation speed multiplier",
		},
		scanlineFrequency: {
			control: { type: "number", min: 0, max: 20, step: 0.5 },
			description: "Frequency of the scanline pattern",
		},
		warpAmount: {
			control: { type: "number", min: 0, max: 5, step: 0.1 },
			description: "Amount of UV warp distortion applied",
		},
	},
	args: {
		hueShift: 0,
		noiseIntensity: 0,
		scanlineIntensity: 0,
		speed: 0.5,
		scanlineFrequency: 0,
		warpAmount: 0,
	},
	decorators: [
		(Story) => (
			<div className="w-full h-[500px] relative overflow-hidden bg-black">
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof DarkVeil>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default dark veil with no post-processing effects. */
export const Default: Story = {};

/** Hue-shifted variant with a 180-degree color rotation. */
export const WithHueShift: Story = {
	args: {
		hueShift: 180,
	},
};

/** Retro CRT look with scanlines and subtle noise. */
export const RetroScanlines: Story = {
	args: {
		scanlineIntensity: 0.5,
		scanlineFrequency: 8,
		noiseIntensity: 0.1,
	},
};

/** Warped veil with slow, distorted UV animation. */
export const WarpedVeil: Story = {
	args: {
		warpAmount: 2,
		speed: 0.3,
	},
};
