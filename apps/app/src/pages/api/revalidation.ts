import type { NextApiRequest, NextApiResponse } from "next";
import { validatePath } from "../../lib/revalidation";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { token, path } = req.query;

	if (token !== process.env.REVALIDATION_TOKEN) {
		return res.status(401).json({ message: "Invalid token" });
	}

	if (!validatePath(path)) {
		return res.status(400).json({ message: "Incorrect path format" });
	}

	try {
		await res.revalidate(path);
		return res.status(204).end();
	} catch (err) {
		return res.status(500).json({ message: "Error revalidating" });
	}
}
