import { describe, expect, it } from "vitest";
import { getPages } from "./QuestionsPagination";

describe("QuestionsPagination", () => {
	it.each([
		{ first: 1, last: 6, current: 1, expected: [1, 2, 3, 4, 6] },
		{ first: 1, last: 6, current: 2, expected: [1, 2, 3, 4, 6] },
		{ first: 1, last: 6, current: 3, expected: [1, 2, 3, 4, 6] },
		{ first: 1, last: 6, current: 4, expected: [1, 3, 4, 5, 6] },
		{ first: 1, last: 7, current: 5, expected: [1, 4, 5, 6, 7] },
		{ first: 1, last: 5, current: 3, expected: [1, 2, 3, 4, 5] },
		{ first: 1, last: 5, current: 4, expected: [1, 2, 3, 4, 5] },
		{ first: 1, last: 5, current: 5, expected: [1, 2, 3, 4, 5] },
		{ first: 1, last: 871, current: 412, expected: [1, 411, 412, 413, 871] },
		{ first: 1, last: 872, current: 313, expected: [1, 312, 313, 314, 872] },
		{ first: 1, last: 872, current: 2, expected: [1, 2, 3, 4, 872] },
		{ first: 1, last: 872, current: 871, expected: [1, 869, 870, 871, 872] },
	])(
		`getPages({first: $first, last: $last, current: $current}) returns $expected`,
		({ first, last, current, expected }) => {
			expect(getPages({ first, last, current })).toEqual(expected);
		},
	);
});
