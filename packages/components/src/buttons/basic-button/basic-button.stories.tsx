import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { BasicButton } from "./basic-button";

/**
 * A versatile button component with multiple variants, sizes, ripple click effect,
 * loading state, and icon support. Source: Sera UI.
 */
const meta = {
	title: "Buttons/Basic Button",
	component: BasicButton,
	tags: ["autodocs"],
	argTypes: {
		variant: {
			control: "select",
			options: ["default", "destructive", "outline", "secondary", "ghost", "link"],
			description: "Visual style variant",
		},
		size: {
			control: "select",
			options: ["default", "sm", "lg"],
			description: "Button size",
		},
		loading: {
			control: "boolean",
			description: "Shows loading spinner and disables interaction",
		},
		disabled: {
			control: "boolean",
			description: "Disables the button",
		},
		children: {
			control: "text",
			description: "Button label text",
		},
	},
	args: {
		children: "Click me",
		variant: "default",
		size: "default",
	},
} satisfies Meta<typeof BasicButton>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default button with primary styling and ripple effect on click. */
export const Default: Story = {};

/** All six visual variants displayed together. */
export const AllVariants: Story = {
	render: () => (
		<div className="flex flex-wrap items-center gap-4">
			<BasicButton variant="default">Default</BasicButton>
			<BasicButton variant="destructive">Destructive</BasicButton>
			<BasicButton variant="outline">Outline</BasicButton>
			<BasicButton variant="secondary">Secondary</BasicButton>
			<BasicButton variant="ghost">Ghost</BasicButton>
			<BasicButton variant="link">Link</BasicButton>
		</div>
	),
};

/** Three sizes: small, default, and large. */
export const Sizes: Story = {
	render: () => (
		<div className="flex items-center gap-4">
			<BasicButton size="sm">Small</BasicButton>
			<BasicButton size="default">Default</BasicButton>
			<BasicButton size="lg">Large</BasicButton>
		</div>
	),
};

/** Loading state disables interaction and shows a spinner. */
export const Loading: Story = {
	args: {
		loading: true,
		children: "Saving...",
	},
};

/** Buttons with leading and trailing icons. */
export const WithIcons: Story = {
	render: () => {
		const PlusIcon = () => (
			<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
				<path d="M12 5v14M5 12h14" />
			</svg>
		);
		const ArrowIcon = () => (
			<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
				<path d="M5 12h14M12 5l7 7-7 7" />
			</svg>
		);

		return (
			<div className="flex items-center gap-4">
				<BasicButton iconLeft={<PlusIcon />}>Add Item</BasicButton>
				<BasicButton iconRight={<ArrowIcon />}>Continue</BasicButton>
				<BasicButton iconLeft={<PlusIcon />} iconRight={<ArrowIcon />}>
					Both
				</BasicButton>
			</div>
		);
	},
};

/** Icon-only buttons with no text children. */
export const IconOnly: Story = {
	render: () => {
		const HeartIcon = () => (
			<svg
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
			>
				<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
			</svg>
		);

		return (
			<div className="flex items-center gap-4">
				<BasicButton size="sm" iconLeft={<HeartIcon />} />
				<BasicButton size="default" iconLeft={<HeartIcon />} />
				<BasicButton size="lg" iconLeft={<HeartIcon />} />
			</div>
		);
	},
};
