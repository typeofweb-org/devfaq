import { describe, expect, it } from "vitest";
import { range } from "./utils";

describe("utils", () => {
	describe("range", () => {
		// prettier-ignore
		it.each([
			{ start: 0, end: 1, expected: [0] },
			{ start: 0, end: 10, expected: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] },
			{ start: 10, end: 11, expected: [10] },
			{ start: 10, end: 15, expected: [10, 11, 12, 13, 14] },
		])(`rand($start, $end) returns $expected`, ({ start, end, expected }) => {
			expect(range(start, end)).toEqual(expected);
		});
	});
});
