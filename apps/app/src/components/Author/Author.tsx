import Image from "next/image";
import { Contributor } from "../../lib/contributors";

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
	bug: "Bugi",
};

export const Author = ({
	contributor: { login, profile, avatar_url, name, contributions },
}: AuthorProps) => {
	const translatedContributions = contributions.map(
		(contribution) => contributionTranslations[contribution] || contribution,
	);

	return (
		<a href={profile} target="_blank" rel="noreferrer">
			<article className="flex h-full flex-col items-center rounded-lg bg-neutral-100 px-3.5 py-6 text-center shadow-[0px_1px_4px] shadow-neutral-400 active:translate-y-px dark:bg-neutral-700 dark:shadow-neutral-900">
				<Image
					src={avatar_url}
					alt={`Avatar użytkownika o loginie ${login}`}
					width={125}
					height={125}
					className="mb-5 rounded-full"
				/>
				<h3 className="mb-1 font-semibold">
					<span className="sr-only">Imię:</span>
					{name}
				</h3>
				<p className="text-center font-semibold leading-tight text-violet-600 dark:text-violet-400">
					<span className="sr-only">Zasługi:</span>
					{translatedContributions.join(", ")}
				</p>
			</article>
		</a>
	);
};
