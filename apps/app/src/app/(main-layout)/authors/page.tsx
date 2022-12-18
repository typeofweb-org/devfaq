import { Author } from "../../../components/Author/Author";
import { StaticPageContainer } from "../../../components/StaticPageContainer";
import { getAllContributors } from "../../../lib/github";

export default async function AuthorsPage() {
	const contributors = await getAllContributors();

	return (
		<StaticPageContainer>
			<h2 className="mb-8 text-4xl font-bold">Autorzy</h2>
			<ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
				{contributors.map((contributor) => (
					<li key={contributor.login}>
						<Author contributor={contributor} />
					</li>
				))}
			</ul>
		</StaticPageContainer>
	);
}
