import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import FancyAccordion from "./fancy-accordion";

const sampleItems = [
	{ question: "How do I get started?", answer: "Getting started is easy! Just follow the simple steps outlined in our comprehensive setup guide, which will walk you through the entire process from beginning to end." },
	{ question: "Where can I find my account details?", answer: "You can find all of your account information, including your profile, settings, and billing history, on the 'My Account' page once you have successfully logged in." },
	{ question: "How do I reset my password?", answer: "To reset your password, please click the \"Forgot Password\" link on the login page. We will then send an email with further instructions to your registered email address." },
	{ question: "Who can I contact for support?", answer: "Our dedicated support team is available around the clock to assist you. You can reach us through the contact form on our website or by sending an email to support@example.com." },
];

/**
 * A green-themed accordion with gradient overlay and backdrop blur effects.
 * Supports defaultOpen prop to control which item is initially expanded.
 * Source: Sera UI.
 */
const meta = {
	title: "Accordions/Fancy Accordion",
	component: FancyAccordion,
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
} satisfies Meta<typeof FancyAccordion>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default accordion with first item open. */
export const Default: Story = {};

/** All items closed on initial render. */
export const AllClosed: Story = {
	args: {
		defaultOpen: null,
	},
};
