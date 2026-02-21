import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import GlitchVault from "./glitch-vault-card";

/**
 * A card component with matrix/glitch text effect on hover.
 * Features particle pooling, offscreen canvas rendering, and configurable
 * performance modes. Source: Sera UI.
 */
const meta = {
	title: "Cards/Glitch Vault Card",
	component: GlitchVault,
	argTypes: {
		glitchColor: {
			control: "color",
			description: "Color of the glitch/matrix text effect",
		},
		glitchRadius: {
			control: { type: "number", min: 20, max: 300, step: 10 },
			description: "Radius of the glitch effect around the cursor",
		},
		performanceMode: {
			control: "select",
			options: ["high", "balanced", "low"],
			description: "Performance mode for the animation",
		},
		disabled: {
			control: "boolean",
			description: "Disable the glitch effect entirely",
		},
	},
	decorators: [
		(Story) => (
			<div className="w-full min-h-[400px] flex items-center justify-center bg-gray-950 p-6">
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof GlitchVault>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default glitch vault with cyan glitch color. */
export const Default: Story = {
	args: {
		className: "w-full max-w-sm backdrop-blur-xl bg-white/20 dark:bg-black/20 border border-white/30 rounded-2xl",
		glitchColor: "#0AF0F0",
		children: (
			<div className="p-8 text-center">
				<h2 className="text-2xl font-bold text-white mb-2">Glitch Vault</h2>
				<p className="text-gray-300">Hover to reveal the matrix effect</p>
			</div>
		),
	},
};

/** Red glitch variant with tighter radius. */
export const RedGlitch: Story = {
	args: {
		className: "w-full max-w-sm backdrop-blur-xl bg-white/20 dark:bg-black/20 border border-white/30 rounded-2xl",
		glitchColor: "#FF6B6B",
		glitchRadius: 80,
		children: (
			<div className="p-8 text-center">
				<h2 className="text-2xl font-bold text-white mb-2">Red Vault</h2>
				<p className="text-gray-300">Compact red glitch effect</p>
			</div>
		),
	},
};

/** Glitch effect disabled — plain card rendering. */
export const Disabled: Story = {
	args: {
		className: "w-full max-w-sm backdrop-blur-xl bg-white/20 dark:bg-black/20 border border-white/30 rounded-2xl",
		disabled: true,
		children: (
			<div className="p-8 text-center">
				<h2 className="text-2xl font-bold text-white mb-2">Disabled Vault</h2>
				<p className="text-gray-300">Glitch effect is turned off</p>
			</div>
		),
	},
};
