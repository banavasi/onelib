import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { ChromaGrid } from "./chroma-grid";

/**
 * GSAP-powered interactive card grid with a spotlight/chroma effect that follows the cursor.
 * Cards reveal color on hover with a radial gradient mask and per-card spotlight tracking. Source: ReactBits.
 */
const meta = {
	title: "Gallery/ChromaGrid",
	component: ChromaGrid,
	argTypes: {
		radius: {
			control: { type: "number", min: 100, max: 600, step: 10 },
			description: "Radius of the spotlight reveal area in pixels",
		},
		columns: {
			control: { type: "number", min: 1, max: 6, step: 1 },
			description: "Number of grid columns",
		},
		rows: {
			control: { type: "number", min: 1, max: 6, step: 1 },
			description: "Number of grid rows",
		},
		damping: {
			control: { type: "number", min: 0.1, max: 1, step: 0.05 },
			description: "Damping factor for spotlight follow animation",
		},
		fadeOut: {
			control: { type: "number", min: 0.1, max: 2, step: 0.1 },
			description: "Duration of the fade-out when pointer leaves the grid",
		},
		ease: {
			control: "text",
			description: "GSAP easing function for spotlight animation",
		},
		items: {
			control: "object",
			description:
				"Array of card items with image, title, subtitle, handle, borderColor, gradient, and url",
		},
	},
	args: {
		radius: 300,
		columns: 3,
		rows: 2,
		damping: 0.45,
		fadeOut: 0.6,
		ease: "power3.out",
	},
	decorators: [
		(Story) => (
			<div className="w-full min-h-[600px] relative overflow-hidden bg-black flex items-center justify-center">
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof ChromaGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default chroma grid with built-in demo data (6 profile cards). */
export const Default: Story = {};

/** Custom layout with 2 columns, 3 rows, and a larger spotlight radius. */
export const CustomLayout: Story = {
	args: {
		columns: 2,
		rows: 3,
		radius: 400,
	},
};
