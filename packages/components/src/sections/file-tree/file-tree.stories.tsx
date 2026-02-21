import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { FileTree } from "./file-tree";
import type { FileTreeItem } from "./file-tree";

/**
 * Interactive file tree explorer with folder expand/collapse, file type icons, and
 * selection highlighting. Self-contained with inline SVG icons. Source: Sera UI.
 */
const meta = {
	title: "Sections/File Tree",
	component: FileTree,
	parameters: {
		layout: "centered",
	},
} satisfies Meta<typeof FileTree>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default file tree with demo project structure. */
export const Default: Story = {};

/** Empty file tree with no items. */
export const Empty: Story = {
	args: {
		data: [],
	},
};

const customData: FileTreeItem[] = [
	{
		name: "app",
		type: "folder",
		children: [
			{ name: "page.tsx", type: "file" },
			{ name: "layout.tsx", type: "file" },
			{
				name: "api",
				type: "folder",
				children: [{ name: "route.ts", type: "file" }],
			},
		],
	},
	{ name: "next.config.js", type: "file" },
];

/** Custom file tree data showing a Next.js project structure. */
export const CustomData: Story = {
	args: {
		data: customData,
	},
};
