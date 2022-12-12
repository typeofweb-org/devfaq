import { fetcher } from "../lib/fetcher";

export const getLoggedInUser = fetcher.path("/auth/me").method("get").create();
