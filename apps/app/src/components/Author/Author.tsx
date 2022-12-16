import Image from "next/image";
import { Contributor } from "../../lib/github";

type AuthorProps = Readonly<{
	contributor: Contributor;
}>;

const contributionTranslations: Record<string, string> = {
	code: "Kod",
	content: "Treść",
	design: "Design",
	doc: "Dokumentacja",
	ideas: "Pomysły",
	maintenance: "Utrzymanie",
	platform: "Platforma",
	review: "Code Review",
};

export const Author = ({
	contributor: { login, profile, avatar_url, name, contributions },
}: AuthorProps) => {
	const translatedContributions = contributions.map(
		(contribution) => contributionTranslations[contribution] || contribution,
	);

	return (
		<a
			key={login}
			href={profile}
			target="_blank"
			className="flex flex-col items-center rounded-lg bg-neutral-100 px-3.5 py-6 shadow-[0px_1px_4px] shadow-neutral-400 active:translate-y-px dark:bg-neutral-700 dark:shadow-neutral-900"
			rel="noreferrer"
		>
			<Image
				src={avatar_url}
				alt={`${login}-avatar`}
				width={125}
				height={125}
				className="mb-5 rounded-full"
			/>
			<strong className="mb-1 font-semibold">{name}</strong>
			<strong className="text-center font-semibold leading-tight text-violet-600 dark:text-violet-400">
				{translatedContributions.join(", ")}
			</strong>
		</a>
	);
};
