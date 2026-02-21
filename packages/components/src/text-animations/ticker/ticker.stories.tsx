import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { NumberTicker } from "./ticker";

/**
 * Animated number counter with easeOutExpo easing.
 * Counts from zero to a target value with configurable duration.
 * Source: Sera UI.
 */
const meta = {
	title: "Text Animations/Ticker",
	component: NumberTicker,
	argTypes: {
		value: {
			control: { type: "number" },
			description: "Target number to count to",
		},
		duration: {
			control: { type: "number", min: 500, max: 10000, step: 500 },
			description: "Animation duration in milliseconds",
		},
		delay: {
			control: { type: "number", min: 0, max: 5000, step: 100 },
			description: "Delay before animation starts (ms)",
		},
		decimalPlaces: {
			control: { type: "number", min: 0, max: 4, step: 1 },
			description: "Number of decimal places to display",
		},
		prefix: {
			control: "text",
			description: "Text to display before the number",
		},
		suffix: {
			control: "text",
			description: "Text to display after the number",
		},
		className: {
			control: "text",
			description: "Additional CSS classes",
		},
	},
	args: {
		value: 1000,
		duration: 2000,
		delay: 0,
		decimalPlaces: 0,
		prefix: "$",
		suffix: "",
	},
	decorators: [
		(Story) => (
			<div className="w-full h-[200px] flex items-center justify-center text-5xl font-bold">
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof NumberTicker>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default number ticker counting to $1,000. */
export const Default: Story = {};

/** Percentage display with one decimal place. */
export const Percentage: Story = {
	args: {
		value: 99.9,
		suffix: "%",
		prefix: "",
		decimalPlaces: 1,
	},
};

/** Slow count to 500 over 5 seconds. */
export const SlowCount: Story = {
	args: {
		value: 500,
		duration: 5000,
		prefix: "",
	},
};
