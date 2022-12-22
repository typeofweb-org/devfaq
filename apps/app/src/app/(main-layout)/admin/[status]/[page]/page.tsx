import { redirect } from "next/navigation";
import dynamic from "next/dynamic";
import { PrivateRoute } from "../../../../../components/PrivateRoute";
import { parseQueryLevels } from "../../../../../lib/level";
import { statuses } from "../../../../../lib/question";
import { parseTechnologyQuery } from "../../../../../lib/technologies";
import { Params, SearchParams } from "../../../../../types";

const AdminPanel = dynamic(
	() => import("../../../../../components/AdminPanel/AdminPanel").then((mod) => mod.AdminPanel),
	{ ssr: false },
);

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
		<PrivateRoute loginPreviousPath="/">
			<AdminPanel page={page} technology={technology} status={params.status} levels={levels} />
		</PrivateRoute>
	);
}
