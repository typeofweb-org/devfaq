import { fetcher } from "../lib/fetcher";

export const getAllQuestions = fetcher.path("/questions").method("get").create();

export const getQuestionsVotes = fetcher.path("/questions/votes").method("get").create();

export const getQuestionVotesById = fetcher.path("/questions/{id}/votes").method("get").create();

export const getQuestionById = fetcher.path("/questions/{id}").method("get").create();

export const upvoteQuestion = fetcher.path("/questions/{id}/votes").method("post").create();

export const downvoteQuestion = fetcher.path("/questions/{id}/votes").method("delete").create();

export const createQuestion = fetcher.path("/questions").method("post").create();
