import { Meta, StoryObj } from "@storybook/react";
import { QuestionItem } from "./QuestionItem";

const meta: Meta<typeof QuestionItem> = {
	title: "QuestionItem",
	component: QuestionItem,
	args: {
		title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
		creationDate: new Date(),
		votes: 1,
		voted: true,
	},
};

export default meta;

type Story = StoryObj<typeof QuestionItem>;

export const Junior: Story = {
	args: {
		level: "junior",
	},
};

export const Mid: Story = {
	args: {
		level: "mid",
	},
};

export const Senior: Story = {
	args: {
		level: "senior",
	},
};
