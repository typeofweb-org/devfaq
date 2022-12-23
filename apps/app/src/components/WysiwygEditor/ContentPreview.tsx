import { use } from "react";
import { serializeSource } from "../../lib/markdown";
import { MarkDownContent } from "../MarkDownContent";

export const ContentPreview = ({ content }: { readonly content: string }) => {
	const source = use(serializeSource(content));

	return (
		<div className="h-full overflow-auto bg-neutral-50 p-2 dark:bg-neutral-700">
			<MarkDownContent source={source} />
		</div>
	);
};
