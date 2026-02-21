import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { Tabs } from "./tabs";

const demoItems = [
	{
		label: "Overview",
		value: "overview",
		content: (
			<div className="p-6 bg-gray-900 rounded-xl border border-white/5">
				<h3 className="text-lg font-semibold text-white mb-2">Overview</h3>
				<p className="text-gray-400">
					This is the overview tab content. It provides a high-level summary of
					the main features and capabilities of the product.
				</p>
			</div>
		),
	},
	{
		label: "Features",
		value: "features",
		content: (
			<div className="p-6 bg-gray-900 rounded-xl border border-white/5">
				<h3 className="text-lg font-semibold text-white mb-2">Features</h3>
				<ul className="space-y-2 text-gray-400">
					<li>Animated tab transitions with motion</li>
					<li>Keyboard accessible navigation</li>
					<li>Customizable styling via className</li>
					<li>Controlled and uncontrolled modes</li>
				</ul>
			</div>
		),
	},
	{
		label: "Settings",
		value: "settings",
		content: (
			<div className="p-6 bg-gray-900 rounded-xl border border-white/5">
				<h3 className="text-lg font-semibold text-white mb-2">Settings</h3>
				<p className="text-gray-400">
					Configure your preferences and customize the behavior of the
					component to match your requirements.
				</p>
			</div>
		),
	},
];

/**
 * Animated tab component with spring-based active indicator and content transitions.
 * Accepts an array of tab items with label, value, and content. Source: Sera UI.
 */
const meta = {
	title: "Sections/Tabs",
	component: Tabs,
	argTypes: {
		defaultValue: {
			control: "text",
			description: "Initial active tab value",
		},
		className: {
			control: "text",
			description: "Additional CSS classes for the wrapper",
		},
	},
	args: {
		items: demoItems,
	},
	decorators: [
		(Story) => (
			<div className="w-full max-w-2xl mx-auto p-8">
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default tabs with three panels and animated transitions. */
export const Default: Story = {};

/** Tabs with a pre-selected default value. */
export const WithDefaultValue: Story = {
	args: {
		defaultValue: "features",
	},
};

/** Tabs with two items only. */
export const TwoTabs: Story = {
	args: {
		items: [
			{
				label: "Tab 1",
				value: "tab1",
				content: (
					<div className="p-6 bg-gray-900 rounded-xl border border-white/5">
						<p className="text-gray-400">Content for Tab 1</p>
					</div>
				),
			},
			{
				label: "Tab 2",
				value: "tab2",
				content: (
					<div className="p-6 bg-gray-900 rounded-xl border border-white/5">
						<p className="text-gray-400">Content for Tab 2</p>
					</div>
				),
			},
		],
	},
};
