import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { HeaderComponent } from "./navbar";

/**
 * Self-contained header/navbar with dropdown navigation, search, mobile menu,
 * and CTA buttons. All sub-components are internal. Source: Sera UI.
 */
const meta = {
	title: "Sections/Navbar",
	component: HeaderComponent,
	parameters: {
		layout: "fullscreen",
	},
	decorators: [
		(Story) => (
			<div className="w-full">
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof HeaderComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default navbar with navigation, search, and mobile menu support. */
export const Default: Story = {};
