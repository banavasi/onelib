import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { OrbitingSkills } from "./orbiting";

/**
 * Orbital animation visualization showing tech icons orbiting around a center element.
 * Self-contained with inline SVG icons and CSS keyframe animations. Source: Sera UI.
 */
const meta = {
	title: "Sections/Orbiting",
	component: OrbitingSkills,
	parameters: {
		layout: "centered",
	},
	decorators: [
		(Story) => (
			<div className="w-full h-[500px] flex items-center justify-center bg-gray-950">
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof OrbitingSkills>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default orbiting skills visualization with inner and outer orbit rings. */
export const Default: Story = {};
