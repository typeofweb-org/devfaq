import { Author } from "../../../../components/Author/Author";
import { StaticPageContainer } from "../../../../components/StaticPageContainer";
import { getAllContributors } from "../../../../lib/contributors";

export default function AuthorsPage() {
	return (
		<StaticPageContainer>
			<h1 className="mb-8 text-4xl font-bold">Autorzy</h1>
			<ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
				{getAllContributors().map((contributor) => (
					<li key={contributor.login} className="p-0">
						<Author contributor={contributor} />
					</li>
				))}
			</ul>
		</StaticPageContainer>
	);
}
