import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import Accordion from "./basic-accordion";

const sampleItems = [
	{ title: "What are the key features of React?", content: "React's key features include its component-based architecture, virtual DOM for performance, JSX for templating, and one-way data flow." },
	{ title: "How does Tailwind CSS improve development speed?", content: "Tailwind CSS accelerates development by providing a vast library of utility classes that can be applied directly in your HTML." },
	{ title: "What are best practices for accessibility?", content: "Best practices include using semantic HTML, providing text alternatives for images, ensuring sufficient color contrast, and enabling keyboard navigation." },
];

/**
 * A minimalistic accordion component with plus icon that rotates 45deg on open.
 * Manages single-open state with memo'd items. Source: Sera UI.
 */
const meta = {
	title: "Accordions/Basic Accordion",
	component: Accordion,
	args: {
		items: sampleItems,
	},
	decorators: [
		(Story) => (
			<div className="w-full max-w-2xl mx-auto p-6">
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default accordion with sample FAQ items. */
export const Default: Story = {};

/** Accordion with one item pre-expanded. */
export const SingleItemOpen: Story = {
	render: (args) => {
		const AccordionWithOpen = () => {
			const [, setForce] = React.useState(0);
			const ref = React.useRef<HTMLDivElement>(null);
			React.useEffect(() => {
				const btn = ref.current?.querySelector("button");
				if (btn) btn.click();
				setForce(1);
			}, []);
			return (
				<div ref={ref}>
					<Accordion {...args} />
				</div>
			);
		};
		return <AccordionWithOpen />;
	},
};
