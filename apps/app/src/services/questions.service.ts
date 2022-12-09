import { fetcher } from "../lib/fetcher";

export const getAllQuestions = fetcher.path("/questions").method("get").create();
