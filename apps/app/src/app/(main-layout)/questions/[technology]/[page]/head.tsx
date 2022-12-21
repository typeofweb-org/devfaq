import { HeadTags } from "../../../../../components/HeadTags";
import { technologiesLabel, validateTechnology } from "../../../../../lib/technologies";
import { Params } from "../../../../../types";

export default function Head({ params: { technology } }: { params: Params<"technology"> }) {
	const label = validateTechnology(technology) ? technologiesLabel[technology] : "";

	return <HeadTags title={`Pytania ${label}`} />;
}
