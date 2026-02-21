import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import DomeGallery from "./dome-gallery";

/**
 * Interactive 3D spherical image gallery with drag navigation and click-to-enlarge.
 * Images are mapped onto a dome surface that responds to mouse/touch drag gestures.
 * Requires `@use-gesture/react` peer dependency. Source: ReactBits.
 */
const meta = {
	title: "Gallery/Dome Gallery",
	component: DomeGallery,
	tags: ["autodocs"],
	argTypes: {
		images: {
			control: "object",
			description: "Array of image URLs or { src, alt } objects to display on the dome",
		},
		fit: {
			control: { type: "number", min: 0.5, max: 2, step: 0.1 },
			description: "Fit factor controlling how tightly images pack on the dome",
		},
		segments: {
			control: { type: "number", min: 4, max: 16, step: 1 },
			description: "Number of segments (columns) on the dome",
		},
		dragSensitivity: {
			control: { type: "number", min: 0.5, max: 5, step: 0.1 },
			description: "How responsive the dome is to drag gestures",
		},
		grayscale: {
			control: "boolean",
			description: "Apply grayscale filter to images",
		},
		overlayBlurColor: {
			control: "color",
			description: "Color of the edge overlay blur effect",
		},
	},
	args: {
		images: [
			"https://picsum.photos/seed/dome1/400/300",
			"https://picsum.photos/seed/dome2/400/300",
			"https://picsum.photos/seed/dome3/400/300",
			"https://picsum.photos/seed/dome4/400/300",
			"https://picsum.photos/seed/dome5/400/300",
			"https://picsum.photos/seed/dome6/400/300",
			"https://picsum.photos/seed/dome7/400/300",
			"https://picsum.photos/seed/dome8/400/300",
			"https://picsum.photos/seed/dome9/400/300",
			"https://picsum.photos/seed/dome10/400/300",
			"https://picsum.photos/seed/dome11/400/300",
			"https://picsum.photos/seed/dome12/400/300",
		],
	},
	decorators: [
		(Story) => (
			<div className="w-full h-[600px] relative rounded-lg overflow-hidden bg-black">
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof DomeGallery>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default dome gallery with 12 placeholder images. Drag to rotate, click to enlarge. */
export const Default: Story = {};

/** Gallery with fewer images showing more spacing on the dome. */
export const FewImages: Story = {
	args: {
		images: [
			"https://picsum.photos/seed/few1/400/300",
			"https://picsum.photos/seed/few2/400/300",
			"https://picsum.photos/seed/few3/400/300",
			"https://picsum.photos/seed/few4/400/300",
			"https://picsum.photos/seed/few5/400/300",
			"https://picsum.photos/seed/few6/400/300",
		],
	},
};

/** Grayscale filter applied to all images. */
export const Grayscale: Story = {
	args: {
		grayscale: true,
	},
};

/** Custom overlay color giving a warmer edge effect. */
export const WarmOverlay: Story = {
	args: {
		overlayBlurColor: "#1a0a00",
	},
};
