import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { GridScan } from "./grid-scan";

/**
 * Three.js + postprocessing background with 3D grid scanner effect and optional webcam/face tracking.
 * Uses GLSL shaders for animated scan lines, bloom, and chromatic aberration. Source: ReactBits.
 */
const meta = {
	title: "Backgrounds/GridScan",
	component: GridScan,
	argTypes: {
		lineThickness: {
			control: { type: "number", min: 0.1, max: 5, step: 0.1 },
			description: "Thickness of the grid lines",
		},
		linesColor: {
			control: "color",
			description: "Color of the grid lines",
		},
		scanColor: {
			control: "color",
			description: "Color of the scan beam",
		},
		scanOpacity: {
			control: { type: "number", min: 0, max: 1, step: 0.05 },
			description: "Opacity of the scan beam",
		},
		gridScale: {
			control: { type: "number", min: 0.01, max: 1, step: 0.01 },
			description: "Scale of the grid cells",
		},
		lineStyle: {
			control: { type: "select" },
			options: ["solid", "dashed", "dotted"],
			description: "Style of the grid lines",
		},
		lineJitter: {
			control: { type: "number", min: 0, max: 1, step: 0.05 },
			description: "Amount of jitter applied to grid lines",
		},
		scanDirection: {
			control: { type: "select" },
			options: ["forward", "backward", "pingpong"],
			description: "Direction of the scan beam animation",
		},
		noiseIntensity: {
			control: { type: "number", min: 0, max: 0.2, step: 0.005 },
			description: "Intensity of noise grain overlay",
		},
		bloomIntensity: {
			control: { type: "number", min: 0, max: 5, step: 0.1 },
			description: "Intensity of the bloom post-processing effect",
		},
		scanGlow: {
			control: { type: "number", min: 0.1, max: 3, step: 0.1 },
			description: "Glow width of the scan beam",
		},
		scanSoftness: {
			control: { type: "number", min: 0.1, max: 5, step: 0.1 },
			description: "Softness of the scan beam edges",
		},
		scanDuration: {
			control: { type: "number", min: 0.5, max: 10, step: 0.5 },
			description: "Duration of one scan cycle in seconds",
		},
		scanDelay: {
			control: { type: "number", min: 0, max: 10, step: 0.5 },
			description: "Delay between scan cycles in seconds",
		},
		scanOnClick: {
			control: "boolean",
			description: "Trigger an additional scan on click",
		},
		enableWebcam: {
			control: "boolean",
			description: "Enable webcam-based face tracking for parallax",
		},
		sensitivity: {
			control: { type: "number", min: 0, max: 1, step: 0.05 },
			description: "Sensitivity of mouse/face tracking response",
		},
	},
	args: {
		lineThickness: 1,
		linesColor: "#392e4e",
		scanColor: "#FF9FFC",
		scanOpacity: 0.4,
		gridScale: 0.1,
		lineStyle: "solid",
		lineJitter: 0.1,
		scanDirection: "pingpong",
		noiseIntensity: 0.01,
		bloomIntensity: 0,
		scanGlow: 0.5,
		scanSoftness: 2,
		scanDuration: 2.0,
		scanDelay: 2.0,
		scanOnClick: false,
		enableWebcam: false,
		sensitivity: 0.55,
	},
	decorators: [
		(Story) => (
			<div className="w-full h-[500px] relative overflow-hidden bg-black">
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof GridScan>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default grid scan with purple lines and pink scan beam in pingpong mode. */
export const Default: Story = {};

/** Dashed grid lines for a more technical appearance. */
export const DashedLines: Story = {
	args: {
		lineStyle: "dashed",
	},
};

/** Click anywhere to trigger an additional scan wave. */
export const ClickToScan: Story = {
	args: {
		scanOnClick: true,
	},
};
