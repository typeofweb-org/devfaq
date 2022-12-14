import { fetcher } from "../lib/fetcher";

export const getAllQuestions = fetcher.path("/questions").method("get").create();

export const getQuestionsVotes = fetcher.path("/questions/votes").method("get").create();

export const upvoteQuestion = fetcher.path("/questions/{id}/votes").method("post").create();

export const downvoteQuestion = fetcher.path("/questions/{id}/votes").method("delete").create();
