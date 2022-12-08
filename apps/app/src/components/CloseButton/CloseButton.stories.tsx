import { Meta, StoryObj } from "@storybook/react";
import { CloseButton } from "./CloseButton";

const meta: Meta<typeof CloseButton> = {
	title: "CloseButton",
	component: CloseButton,
};

export default meta;

type Story = StoryObj<typeof CloseButton>;

export const Default: Story = {};
