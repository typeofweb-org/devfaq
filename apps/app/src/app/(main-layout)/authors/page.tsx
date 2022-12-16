import { Author } from "../../../components/Author/Author";
import { StaticPageContainer } from "../../../components/StaticPageContainer";
import { getAllContributors } from "../../../lib/github";

export default async function AuthorsPage() {
	const contributors = await getAllContributors();

	return (
		<StaticPageContainer>
			<h1 className="mb-8 text-4xl font-bold">Autorzy</h1>
			<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
				{contributors.map((contributor) => (
					<Author key={contributor.login} contributor={contributor} />
				))}
			</div>
		</StaticPageContainer>
	);
}
