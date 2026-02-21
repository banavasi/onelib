import type { Meta, StoryObj } from "@storybook/react-vite";
import React, { useState } from "react";
import { Modal } from "./modal";

const ModalDemo = ({
	size,
	animation,
}: {
	size: "sm" | "md" | "lg" | "xl";
	animation: "scale" | "slide" | "fade" | "bounce";
}) => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div className="flex items-center justify-center p-8">
			<button
				type="button"
				onClick={() => setIsOpen(true)}
				className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
			>
				Open {size} modal ({animation})
			</button>

			<Modal
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				title={`Modal (${size}, ${animation})`}
				size={size}
				animation={animation}
			>
				<div className="space-y-4">
					<p className="text-gray-700 dark:text-gray-300">
						This is a {size} modal with {animation} animation. Click the X
						button, press ESC, or click outside to close.
					</p>
					<div className="flex justify-end">
						<button
							type="button"
							onClick={() => setIsOpen(false)}
							className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
						>
							Close
						</button>
					</div>
				</div>
			</Modal>
		</div>
	);
};

const meta = {
	title: "Sections/Modal",
	component: Modal,
	parameters: {
		layout: "fullscreen",
	},
	tags: [],
	argTypes: {
		size: {
			control: "select",
			options: ["sm", "md", "lg", "xl"],
			description: "Modal width size",
		},
		animation: {
			control: "select",
			options: ["scale", "slide", "fade", "bounce"],
			description: "Entrance/exit animation type",
		},
	},
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SmallScale: Story = {
	render: () => <ModalDemo size="sm" animation="scale" />,
};

export const MediumSlide: Story = {
	render: () => <ModalDemo size="md" animation="slide" />,
};

export const LargeFade: Story = {
	render: () => <ModalDemo size="lg" animation="fade" />,
};

export const ExtraLargeBounce: Story = {
	render: () => <ModalDemo size="xl" animation="bounce" />,
};
