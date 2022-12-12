import { paths } from "openapi-types";

export type UserData =
	paths["/auth/me"]["get"]["responses"][200]["content"]["application/json"]["data"]["_user"];
