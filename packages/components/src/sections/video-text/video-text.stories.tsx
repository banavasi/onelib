import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { VideoText } from "./video-text";

/**
 * Renders text with a video playing inside the letterforms using SVG clip-path masking.
 * Configurable typography, video settings, and text positioning. Source: Sera UI.
 */
const meta = {
	title: "Sections/Video Text",
	component: VideoText,
	parameters: {
		layout: "fullscreen",
	},
	decorators: [
		(Story) => (
			<div className="w-full h-[400px] bg-black">
				<Story />
			</div>
		),
	],
	args: {
		src: "https://www.w3schools.com/html/mov_bbb.mp4",
		children: "HELLO",
	},
} satisfies Meta<typeof VideoText>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default video text with "HELLO" and a sample video. */
export const Default: Story = {};

/** Custom text with adjusted font size. */
export const CustomText: Story = {
	args: {
		children: "VIDEO",
		fontSize: "clamp(4rem, 20vw, 16rem)",
		fontWeight: 800,
	},
};

/** Text aligned to the left. */
export const LeftAligned: Story = {
	args: {
		children: "LEFT",
		textAnchor: "start",
		x: "5%",
	},
};
