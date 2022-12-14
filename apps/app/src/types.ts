import { paths } from "openapi-types";

export type UserData =
	paths["/auth/me"]["get"]["responses"][200]["content"]["application/json"]["data"];

export type SearchParams<T extends string> = {
	[K in T]: string | string[] | undefined;
};
