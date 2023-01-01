import { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";

const meta: Meta<typeof Button> = {
	title: "Button",
	component: Button,
	args: {
		children: "Button",
	},
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Alert: Story = {
	args: {
		variant: "alert",
	},
};

export const Branding: Story = {
	args: {
		variant: "branding",
	},
};

export const BrandingInverse: Story = {
	args: {
		variant: "brandingInverse",
	},
};

export const Alternative: Story = {
	args: {
		variant: "alternative",
	},
};

export const MobileAction: Story = {
	args: {
		variant: "mobileAction",
		children: "+",
	},
};
