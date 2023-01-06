import { paths } from "openapi-types";
import { MDXRemoteSerializeResult } from "next-mdx-remote";

type ExcludeUndefined<T> = Exclude<T, undefined>;
type MdxContent = { mdxContent: MDXRemoteSerializeResult };

export type UserData =
	paths["/auth/me"]["get"]["responses"][200]["content"]["application/json"]["data"];

export type User = UserData["_user"];

export type APIQuestion =
	paths["/questions/{id}"]["get"]["responses"][200]["content"]["application/json"]["data"];

export type QuestionsVotes =
	paths["/questions/votes"]["get"]["responses"][200]["content"]["application/json"];

export type AdminQuestion = APIQuestion & MdxContent;

export type Question = Omit<AdminQuestion, "question">;

export type QuestionFilter = ExcludeUndefined<
	ExcludeUndefined<paths["/questions"]["get"]["parameters"]>["query"]
>;

export type QuestionAnswer =
	paths["/questions/{id}/answers"]["get"]["responses"]["200"]["content"]["application/json"]["data"][0] &
		MdxContent;

export type Params<T extends string> = {
	readonly [K in T]: string;
};

export type QueryParam = string | readonly string[] | undefined;

export type SearchParams<T extends string> = {
	readonly [K in T]?: QueryParam;
};
