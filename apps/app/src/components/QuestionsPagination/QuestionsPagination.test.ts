import { describe, expect, it } from "vitest";
import { getPages, QUESTIONS_PAGINATION_SEPARATOR } from "./QuestionsPagination";

describe("QuestionsPagination", () => {
	// prettier-ignore
	it.each([
		{ first: 1, last: 6, current: 1, expected: [1, 2, 3, 4, QUESTIONS_PAGINATION_SEPARATOR, 6] },
		{ first: 1, last: 6, current: 2, expected: [1, 2, 3, 4, QUESTIONS_PAGINATION_SEPARATOR, 6] },
		{ first: 1, last: 6, current: 3, expected: [1, 2, 3, 4, QUESTIONS_PAGINATION_SEPARATOR, 6] },
		{ first: 1, last: 6, current: 4, expected: [1, QUESTIONS_PAGINATION_SEPARATOR, 3, 4, 5, 6] },
		{ first: 1, last: 7, current: 5, expected: [1, QUESTIONS_PAGINATION_SEPARATOR, 4, 5, 6, 7] },
		{ first: 1, last: 5, current: 3, expected: [1, 2, 3, 4, 5] },
		{ first: 1, last: 5, current: 4, expected: [1, 2, 3, 4, 5] },
		{ first: 1, last: 5, current: 5, expected: [1, 2, 3, 4, 5] },
		{ first: 1, last: 871, current: 412, expected: [1, QUESTIONS_PAGINATION_SEPARATOR, 411, 412, 413, QUESTIONS_PAGINATION_SEPARATOR, 871] },
		{ first: 1, last: 872, current: 313, expected: [1, QUESTIONS_PAGINATION_SEPARATOR, 312, 313, 314, QUESTIONS_PAGINATION_SEPARATOR, 872] },
		{ first: 1, last: 872, current: 2, expected: [1, 2, 3, 4, QUESTIONS_PAGINATION_SEPARATOR, 872] },
		{ first: 1, last: 872, current: 871, expected: [1, QUESTIONS_PAGINATION_SEPARATOR, 869, 870, 871, 872] },
		{ first: 1, last: 1, current: 1, expected: [1] },
		{ first: 1, last: 2, current: 1, expected: [1, 2] },
		{ first: 1, last: 2, current: 2, expected: [1, 2] },
		{ first: 1, last: 3, current: 1, expected: [1, 2, 3] },
		{ first: 1, last: 3, current: 2, expected: [1, 2, 3] },
		{ first: 1, last: 3, current: 3, expected: [1, 2, 3] },
	])(
		`getPages({first: $first, last: $last, current: $current}) returns $expected`,
		({ first, last, current, expected }) => {
			expect(getPages({ first, last, current })).toEqual(expected);
		},
	);
});
