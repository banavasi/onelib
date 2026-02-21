import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { InfiniteDraggableGrid, FALLBACK_GALLERY } from "./infinite-grid";

/**
 * Infinite draggable image grid that wraps seamlessly in all directions.
 * Click and drag to pan. Source: Sera UI.
 */
const meta = {
	title: "Sections/Infinite Grid",
	component: InfiniteDraggableGrid,
	parameters: {
		layout: "fullscreen",
	},
	decorators: [
		(Story) => (
			<div className="w-full h-[500px] bg-black">
				<Story />
			</div>
		),
	],
	args: {
		gallery: FALLBACK_GALLERY,
	},
} satisfies Meta<typeof InfiniteDraggableGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default infinite grid with sample images. Drag to explore. */
export const Default: Story = {};

/** Grid with fewer columns. */
export const TwoColumns: Story = {
	args: {
		columns: 2,
		itemWidth: 360,
		itemHeight: 240,
	},
};
