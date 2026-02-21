import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { Login } from "./login";

const meta = {
	title: "Pages/Login",
	component: Login,
	parameters: {
		layout: "fullscreen",
	},
	tags: [],
} satisfies Meta<typeof Login>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
