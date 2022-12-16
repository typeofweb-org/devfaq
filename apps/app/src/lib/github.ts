export interface Contributor {
	login: string;
	name: string;
	avatar_url: string;
	profile: string;
	contributions: string[];
}

export const getAllContributors = async () => {
	const { content } = await fetch(
		"https://api.github.com/repos/typeofweb/devfaq/contents/.all-contributorsrc",
	).then((res) => res.json() as Promise<{ content: string }>);
	const { contributors } = JSON.parse(Buffer.from(content, "base64").toString()) as {
		contributors: Contributor[];
	};

	return contributors;
};
