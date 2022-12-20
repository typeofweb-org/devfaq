import { Meta, StoryObj } from "@storybook/react";
import { Question } from "./Question";

const meta: Meta<typeof Question> = {
	title: "QuestionItem",
	component: Question,
};

export default meta;

type Story = StoryObj<typeof Question>;

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
