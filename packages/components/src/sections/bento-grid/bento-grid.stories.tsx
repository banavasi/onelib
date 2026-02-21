import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { BentoGrid, BentoCard } from "./bento-grid";

const FeatureIcon = ({ children }: { children: React.ReactNode }) => (
	<svg
		className="w-5 h-5"
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		{children}
	</svg>
);

const features = [
	{
		title: "Lightning Fast",
		description:
			"Built for performance with optimized rendering and minimal bundle size.",
		icon: (
			<FeatureIcon>
				<path
					d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</FeatureIcon>
		),
	},
	{
		title: "Fully Accessible",
		description:
			"WCAG 2.1 compliant with proper ARIA labels and keyboard navigation support.",
		icon: (
			<FeatureIcon>
				<circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
				<path
					d="M12 8v4l3 3"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
				/>
			</FeatureIcon>
		),
	},
	{
		title: "Type Safe",
		description:
			"Written in TypeScript with comprehensive type definitions for all props and events.",
		icon: (
			<FeatureIcon>
				<path
					d="M4 7V4h16v3M9 20h6M12 4v16"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</FeatureIcon>
		),
		className: "md:col-span-2",
	},
	{
		title: "Dark Mode",
		description:
			"Seamless dark mode support with automatic theme detection and manual toggle.",
		icon: (
			<FeatureIcon>
				<path
					d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</FeatureIcon>
		),
	},
	{
		title: "Responsive Design",
		description:
			"Mobile-first components that adapt beautifully to any screen size.",
		icon: (
			<FeatureIcon>
				<rect
					x="5"
					y="2"
					width="14"
					height="20"
					rx="2"
					stroke="currentColor"
					strokeWidth="2"
				/>
				<path d="M12 18h.01" stroke="currentColor" strokeWidth="2" />
			</FeatureIcon>
		),
	},
	{
		title: "Customizable",
		description:
			"Tailwind CSS powered with full control over colors, spacing, and typography.",
		icon: (
			<FeatureIcon>
				<circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
				<path
					d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"
					stroke="currentColor"
					strokeWidth="2"
				/>
			</FeatureIcon>
		),
		className: "lg:col-span-2",
	},
];

/**
 * Responsive bento grid layout with feature cards. Supports spanning columns,
 * optional icons, links, and custom content. Source: Sera UI.
 */
const meta = {
	title: "Sections/Bento Grid",
	component: BentoGrid,
	decorators: [
		(Story) => (
			<div className="w-full max-w-5xl mx-auto p-8">
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof BentoGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default bento grid with feature cards showcasing various column spans. */
export const Default: Story = {
	render: () => (
		<BentoGrid>
			{features.map((feature) => (
				<BentoCard
					key={feature.title}
					title={feature.title}
					description={feature.description}
					icon={feature.icon}
					className={feature.className}
				/>
			))}
		</BentoGrid>
	),
};

/** Minimal two-column bento grid layout. */
export const TwoColumns: Story = {
	render: () => (
		<BentoGrid className="lg:grid-cols-2">
			{features.slice(0, 4).map((feature) => (
				<BentoCard
					key={feature.title}
					title={feature.title}
					description={feature.description}
					icon={feature.icon}
				/>
			))}
		</BentoGrid>
	),
};

/** Bento cards with link behavior. */
export const WithLinks: Story = {
	render: () => (
		<BentoGrid>
			{features.slice(0, 3).map((feature) => (
				<BentoCard
					key={feature.title}
					title={feature.title}
					description={feature.description}
					icon={feature.icon}
					href="#"
				/>
			))}
		</BentoGrid>
	),
};
