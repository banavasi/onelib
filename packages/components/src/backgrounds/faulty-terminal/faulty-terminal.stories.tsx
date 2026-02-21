import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import FaultyTerminal from "./faulty-terminal";

/**
 * OGL-powered terminal/matrix digit effect with scanlines, glitch distortion, and mouse reactivity.
 * Renders animated digits using fragment shaders with configurable tint, curvature, and effects. Source: ReactBits.
 */
const meta = {
	title: "Backgrounds/FaultyTerminal",
	component: FaultyTerminal,
	argTypes: {
		scale: {
			control: { type: "number", min: 0.5, max: 3, step: 0.1 },
			description: "Overall scale of the terminal grid",
		},
		digitSize: {
			control: { type: "number", min: 0.5, max: 3, step: 0.1 },
			description: "Size of individual digit cells",
		},
		scanlineIntensity: {
			control: { type: "number", min: 0, max: 1, step: 0.05 },
			description: "Intensity of horizontal scanlines",
		},
		glitchAmount: {
			control: { type: "number", min: 0, max: 5, step: 0.1 },
			description: "Amount of horizontal glitch displacement",
		},
		flickerAmount: {
			control: { type: "number", min: 0, max: 3, step: 0.1 },
			description: "Amount of flicker effect",
		},
		noiseAmp: {
			control: { type: "number", min: 0, max: 2, step: 0.1 },
			description: "Amplitude of procedural noise in the pattern",
		},
		chromaticAberration: {
			control: { type: "number", min: 0, max: 10, step: 0.5 },
			description: "Chromatic aberration offset in pixels",
		},
		curvature: {
			control: { type: "number", min: 0, max: 0.5, step: 0.01 },
			description: "CRT-style barrel distortion amount",
		},
		tint: {
			control: "color",
			description: "Color tint applied to the terminal output",
		},
		mouseReact: {
			control: "boolean",
			description: "Whether the effect reacts to mouse movement",
		},
		mouseStrength: {
			control: { type: "number", min: 0, max: 1, step: 0.05 },
			description: "Strength of mouse interaction effect",
		},
		brightness: {
			control: { type: "number", min: 0.1, max: 3, step: 0.1 },
			description: "Overall brightness multiplier",
		},
		pause: {
			control: "boolean",
			description: "Pause the animation",
		},
	},
	args: {
		scale: 1,
		digitSize: 1.5,
		scanlineIntensity: 0.3,
		glitchAmount: 1,
		flickerAmount: 1,
		noiseAmp: 0,
		chromaticAberration: 0,
		curvature: 0.2,
		tint: "#ffffff",
		mouseReact: true,
		mouseStrength: 0.2,
		brightness: 1,
		pause: false,
	},
	decorators: [
		(Story) => (
			<div className="w-full h-[500px] relative overflow-hidden bg-black">
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof FaultyTerminal>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default white terminal with subtle CRT curvature and mouse interaction. */
export const Default: Story = {};

/** Green-tinted terminal reminiscent of classic CRT monitors. */
export const GreenTint: Story = {
	args: {
		tint: "#00ff88",
		brightness: 1.2,
	},
};

/** Heavy glitch and flicker effects with chromatic aberration. */
export const HighGlitch: Story = {
	args: {
		glitchAmount: 3,
		flickerAmount: 2,
		chromaticAberration: 5,
	},
};
