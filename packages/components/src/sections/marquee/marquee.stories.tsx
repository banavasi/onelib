import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { Marquee } from "./marquee";

/**
 * Smooth infinite scrolling marquee with configurable speed, direction,
 * pause-on-hover, and vertical orientation support.
 * Content is repeated for seamless looping. Source: Sera UI.
 */
const meta = {
	title: "Sections/Marquee",
	component: Marquee,
	tags: ["autodocs"],
	argTypes: {
		speed: {
			control: { type: "number", min: 10, max: 200, step: 10 },
			description: "Scroll speed in pixels per second",
		},
		reverse: {
			control: "boolean",
			description: "Reverse the scroll direction",
		},
		pauseOnHover: {
			control: "boolean",
			description: "Pause scrolling when hovered",
		},
		vertical: {
			control: "boolean",
			description: "Scroll vertically instead of horizontally",
		},
		repeat: {
			control: { type: "number", min: 2, max: 8, step: 1 },
			description: "Number of times to repeat the content for seamless looping",
		},
	},
	args: {
		speed: 50,
		reverse: false,
		pauseOnHover: false,
		vertical: false,
		repeat: 4,
	},
	decorators: [
		(Story) => (
			<div className="w-full max-w-3xl overflow-hidden">
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof Marquee>;

export default meta;
type Story = StoryObj<typeof meta>;

const SampleCards = () => (
	<>
		{["React", "TypeScript", "Tailwind", "Vite", "Storybook"].map((tech) => (
			<div
				key={tech}
				className="flex items-center justify-center px-6 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm font-medium whitespace-nowrap"
			>
				{tech}
			</div>
		))}
	</>
);

/** Default horizontal marquee scrolling left. */
export const Default: Story = {
	render: (args) => (
		<Marquee {...args}>
			<SampleCards />
		</Marquee>
	),
};

/** Marquee scrolling in reverse (right-to-left becomes left-to-right). */
export const Reversed: Story = {
	render: (args) => (
		<Marquee {...args}>
			<SampleCards />
		</Marquee>
	),
	args: {
		reverse: true,
	},
};

/** Vertical scrolling marquee. */
export const Vertical: Story = {
	render: (args) => (
		<Marquee {...args}>
			<SampleCards />
		</Marquee>
	),
	args: {
		vertical: true,
	},
	decorators: [
		(Story) => (
			<div className="h-[300px] overflow-hidden">
				<Story />
			</div>
		),
	],
};

/** Hover to pause the scrolling animation. */
export const PauseOnHover: Story = {
	render: (args) => (
		<Marquee {...args}>
			<SampleCards />
		</Marquee>
	),
	args: {
		pauseOnHover: true,
		speed: 80,
	},
};

/** Double-row marquee with opposing directions. */
export const DoubleRow: Story = {
	render: () => (
		<div className="flex flex-col gap-4">
			<Marquee speed={60}>
				<SampleCards />
			</Marquee>
			<Marquee speed={60} reverse>
				<SampleCards />
			</Marquee>
		</div>
	),
};
