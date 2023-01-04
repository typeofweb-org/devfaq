import { HeadTags } from "../../../../../components/HeadTags";
import {
	technologiesLabels,
	technologiesLongLabels,
	validateTechnology,
} from "../../../../../lib/technologies";
import { Params } from "../../../../../types";

export default function Head({ params: { technology } }: { params: Params<"technology"> }) {
	const isValid = validateTechnology(technology);
	if (!isValid) {
		return <HeadTags title="" />;
	}

	const label = technologiesLabels[technology];
	const longLabel = technologiesLongLabels[technology];

	const suffix = longLabel ? `${longLabel} (${label})` : label;

	return <HeadTags title={`Pytania ${suffix}`} />;
}
