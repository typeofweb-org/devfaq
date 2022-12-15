import { paths } from "openapi-types";

type ExcludeUndefined<T> = Exclude<T, undefined>;

export type UserData =
	paths["/auth/me"]["get"]["responses"][200]["content"]["application/json"]["data"];

export type QuestionFilter = ExcludeUndefined<
	ExcludeUndefined<paths["/questions"]["get"]["parameters"]>["query"]
>;

export type Params<T extends string> = {
	readonly [K in T]: string;
};

export type QueryParam = string | readonly string[] | undefined;

export type SearchParams<T extends string> = {
	readonly [K in T]?: QueryParam;
};
