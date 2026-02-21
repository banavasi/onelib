import type { Meta, StoryObj } from "@storybook/react-vite";
import React, { useState } from "react";
import {
	Drawer,
	DrawerOverlay,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	DrawerDescription,
	DrawerFooter,
} from "./drawer";

type DrawerSide = "top" | "bottom" | "left" | "right";

const DrawerDemo = ({ side }: { side: DrawerSide }) => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div className="flex flex-col items-center justify-center p-8 gap-4">
			<button
				type="button"
				onClick={() => setIsOpen(true)}
				className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
			>
				Open {side} drawer
			</button>

			<Drawer open={isOpen} onOpenChange={setIsOpen} side={side}>
				<DrawerOverlay />
				<DrawerContent>
					<DrawerHeader>
						<DrawerTitle>Edit profile</DrawerTitle>
						<DrawerDescription>
							Make changes to your profile here. Click save when you&apos;re
							done.
						</DrawerDescription>
					</DrawerHeader>
					<div className="p-6">
						<form className="grid gap-4">
							<div className="grid gap-2">
								<label
									htmlFor="name"
									className="text-sm font-medium text-gray-700 dark:text-gray-300"
								>
									Name
								</label>
								<input
									id="name"
									defaultValue="John Doe"
									className="flex h-10 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-colors"
								/>
							</div>
							<div className="grid gap-2">
								<label
									htmlFor="username"
									className="text-sm font-medium text-gray-700 dark:text-gray-300"
								>
									Username
								</label>
								<input
									id="username"
									defaultValue="@johndoe"
									className="flex h-10 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-colors"
								/>
							</div>
						</form>
					</div>
					<DrawerFooter>
						<button
							type="button"
							onClick={() => setIsOpen(false)}
							className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
						>
							Cancel
						</button>
						<button
							type="button"
							onClick={() => setIsOpen(false)}
							className="px-4 py-2 bg-gray-900 text-gray-50 rounded-md hover:bg-gray-900/90 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 transition-colors"
						>
							Save changes
						</button>
					</DrawerFooter>
				</DrawerContent>
			</Drawer>
		</div>
	);
};

const meta = {
	title: "Sections/Drawer",
	component: Drawer,
	parameters: {
		layout: "fullscreen",
	},
	tags: [],
	argTypes: {
		side: {
			control: "select",
			options: ["left", "right", "top", "bottom"],
			description: "Which side the drawer slides from",
		},
	},
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Right: Story = {
	render: () => <DrawerDemo side="right" />,
};

export const Left: Story = {
	render: () => <DrawerDemo side="left" />,
};

export const Top: Story = {
	render: () => <DrawerDemo side="top" />,
};

export const Bottom: Story = {
	render: () => <DrawerDemo side="bottom" />,
};
