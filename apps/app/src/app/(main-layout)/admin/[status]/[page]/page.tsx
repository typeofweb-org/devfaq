import { redirect } from "next/navigation";
import { AdminPanel } from "../../../../../components/AdminPanel/AdminPanel";
import { PrivateRoute } from "../../../../../components/PrivateRoute";
import { parseQueryLevels } from "../../../../../lib/level";
import { statuses } from "../../../../../lib/question";
import { parseTechnologyQuery } from "../../../../../lib/technologies";
import { Params, SearchParams } from "../../../../../types";

export default function AdminPage({
	params,
	searchParams,
}: {
	params: Params<"status" | "page">;
	searchParams?: SearchParams<"technology" | "level">;
}) {
	const page = Number.parseInt(params.page);
	const technology = parseTechnologyQuery(searchParams?.technology);
	const levels = parseQueryLevels(searchParams?.level);

	if (Number.isNaN(page) || !statuses.includes(params.status)) {
		return redirect("/admin");
	}

	return (
		<PrivateRoute>
			<AdminPanel page={page} technology={technology} status={params.status} levels={levels} />
		</PrivateRoute>
	);
}
