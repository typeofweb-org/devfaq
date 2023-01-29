import { fetcher } from "../lib/fetcher";

export const getAllAnswers = fetcher.path("/answers").method("get").create();
