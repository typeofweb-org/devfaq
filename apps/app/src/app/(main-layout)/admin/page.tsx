import { redirect } from "next/navigation";

import { PrivateRoute } from "../../../components/PrivateRoute";
import { parsePageQuery } from "../../../lib/queryParsers";
import { parseQueryLevels } from "../../../lib/level";
import { SearchParams } from "../../../types";
import { parseStatusQuery } from "../../../lib/question";
import { parseTechnologyQuery } from "../../../lib/technologies";
import { AdminPanel } from "../../../components/AdminPanel/AdminPanel";

export const dynamic = "force-dynamic";

export default function AdminPage({
	searchParams,
}: {
	searchParams?: SearchParams<"page" | "technology" | "level" | "status">;
}) {
	const page = parsePageQuery(searchParams?.page);
	const technology = parseTechnologyQuery(searchParams?.technology);
	const levels = parseQueryLevels(searchParams?.level);
	const status = parseStatusQuery(searchParams?.status);

	if (!page || !status) {
		return redirect("/admin");
	}

	return (
		<PrivateRoute>
			<AdminPanel page={page} technology={technology} status={status} levels={levels} />
		</PrivateRoute>
	);
}
