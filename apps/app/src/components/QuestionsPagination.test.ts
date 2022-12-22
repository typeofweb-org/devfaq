import { describe, expect, it } from "vitest";
import { getPages } from "./QuestionsPagination";

describe("QuestionsPagination", () => {
	const first = 1;
	const last = 8;

	it(`should return pages: ${first}, 2, 3, 4, ${last}`, () => {
		expect(getPages({ first, current: 1, last })).toEqual([first, 2, 3, 4, last]);
	});

	it(`should return pages: ${first}, 2, 3, 4, ${last}`, () => {
		expect(getPages({ first, current: 2, last })).toEqual([first, 2, 3, 4, last]);
	});

	it(`should return pages: ${first}, 2, 3, 4, ${last}`, () => {
		expect(getPages({ first, current: 3, last })).toEqual([first, 2, 3, 4, last]);
	});

	it(`should return pages: ${first}, 3, 4, 5, ${last}`, () => {
		expect(getPages({ first, current: 4, last })).toEqual([first, 3, 4, 5, last]);
	});

	it(`should return pages: ${first}, 4, 5, 6, ${last}`, () => {
		expect(getPages({ first, current: 5, last })).toEqual([first, 4, 5, 6, last]);
	});

	it(`should return pages: ${first}, 5, 6, 7, ${last}`, () => {
		expect(getPages({ first, current: 6, last })).toEqual([first, 5, 6, 7, last]);
	});

	it(`should return pages: ${first}, 5, 6, 7, ${last}`, () => {
		expect(getPages({ first, current: 7, last })).toEqual([first, 5, 6, 7, last]);
	});

	it(`should return pages: ${first}, 5, 6, 7, ${last}`, () => {
		expect(getPages({ first, current: 8, last })).toEqual([first, 5, 6, 7, last]);
	});
});
