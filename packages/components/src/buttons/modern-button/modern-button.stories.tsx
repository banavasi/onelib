import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { CopyButton, ProcessingButton } from "./modern-button";

/**
 * Modern button components: CopyButton with animated jiggle on copy,
 * and ProcessingButton with idle/processing/success/error state transitions.
 * Source: Sera UI.
 */
const meta = {
	title: "Buttons/Modern Button",
	component: CopyButton,
	argTypes: {
		textToCopy: {
			control: "text",
			description: "Text to copy to clipboard",
		},
		successDuration: {
			control: "number",
			description: "Duration to show success state in ms",
		},
	},
	args: {
		textToCopy: "Hello, World!",
		successDuration: 2000,
	},
} satisfies Meta<typeof CopyButton>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default copy button — click to copy text to clipboard with jiggle animation. */
export const Default: Story = {};

/** Copy button with custom text and longer success duration. */
export const CustomDuration: Story = {
	args: {
		textToCopy: "npm install @oneorigin/onelib",
		successDuration: 3000,
	},
};

/** ProcessingButton with async operation simulation. */
export const Processing: Story = {
	render: () => {
		const handleProcess = () =>
			new Promise<void>((resolve) => setTimeout(resolve, 2000));

		return (
			<div className="flex flex-col items-start gap-4">
				<ProcessingButton onProcess={handleProcess}>
					Download
				</ProcessingButton>
			</div>
		);
	},
};

/** ProcessingButton showing error state. */
export const ProcessingError: Story = {
	render: () => {
		const handleProcess = () =>
			new Promise<void>((_, reject) =>
				setTimeout(() => reject(new Error("Failed")), 1500),
			);

		return (
			<ProcessingButton onProcess={handleProcess}>
				Upload File
			</ProcessingButton>
		);
	},
};

/** Both button types displayed together. */
export const AllVariants: Story = {
	render: () => {
		const handleProcess = () =>
			new Promise<void>((resolve) => setTimeout(resolve, 2000));

		return (
			<div className="flex items-center gap-4">
				<CopyButton textToCopy="Copied text!" />
				<ProcessingButton onProcess={handleProcess}>
					Process
				</ProcessingButton>
			</div>
		);
	},
};
