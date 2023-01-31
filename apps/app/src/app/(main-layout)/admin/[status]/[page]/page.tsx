import { redirect } from "next/navigation";
import dynamic from "next/dynamic";
import { PrivateRoute } from "../../../../../components/PrivateRoute";
import { parseQueryLevels } from "../../../../../lib/level";
import { statuses } from "../../../../../lib/question";
import { parseTechnologyQuery } from "../../../../../lib/technologies";
import { Params, SearchParams } from "../../../../../types";
import { DEFAULT_SORT_BY_QUERY, parseQuerySortBy } from "../../../../../lib/order";

const AdminPanel = dynamic(
	() =>
		import(
			/* webpackChunkName: "AdminPanel" */ "../../../../../components/AdminPanel/AdminPanel"
		).then((mod) => mod.AdminPanel),
	{ ssr: false },
);

export default function AdminPage({
	params,
	searchParams,
}: {
	params: Params<"status" | "page">;
	searchParams?: SearchParams<"technology" | "level" | "sortBy">;
}) {
	const page = Number.parseInt(params.page);
	const technology = parseTechnologyQuery(searchParams?.technology);
	const levels = parseQueryLevels(searchParams?.level);
	const sortBy = parseQuerySortBy(searchParams?.sortBy || DEFAULT_SORT_BY_QUERY);

	if (Number.isNaN(page) || !statuses.includes(params.status)) {
		return redirect("/admin");
	}

	return (
		<PrivateRoute role="admin" loginPreviousPath="/">
			<AdminPanel
				page={page}
				technology={technology}
				status={params.status}
				levels={levels}
				order={sortBy?.order}
				orderBy={sortBy?.orderBy}
			/>
		</PrivateRoute>
	);
}
