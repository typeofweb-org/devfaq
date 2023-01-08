export const revalidate = (path: string) =>
	fetch(
		`/api/revalidation?token=${process.env.NEXT_PUBLIC_REVALIDATION_SECRET || ""}&path=${path}`,
		{ method: "POST" },
	);
