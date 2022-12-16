import { Meta, StoryObj } from "@storybook/react";
import { Author } from "./Author";

const meta: Meta<typeof Author> = {
	title: "Author",
	component: Author,
	args: {
		contributor: {
			login: "xStrixU",
			name: "Kacper Polak",
			avatar_url: "https://avatars.githubusercontent.com/u/41890821?v=4",
			profile: "https://github.com/xStrixU",
			contributions: ["code"],
		},
	},
};

export default meta;

type Story = StoryObj<typeof Author>;

export const Default: Story = {};
