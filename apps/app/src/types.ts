import { paths } from "openapi-types";

export type UserData =
	paths["/auth/me"]["get"]["responses"][200]["content"]["application/json"]["data"];

export type Params<T extends string> = {
	readonly [K in T]: string;
};

export type QueryParam = string | readonly string[] | undefined;

export type SearchParams<T extends string> = {
	readonly [K in T]?: QueryParam;
};
