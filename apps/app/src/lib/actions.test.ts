import { describe, it, expect } from "vitest";
import { handleAction } from "./actions";

describe("actions", () => {
	describe("handleAction", () => {
		it("should return bold word", () => {
			expect(
				handleAction({ selection: { start: 0, end: 5 }, action: "BOLD", value: "test1" }),
			).toStrictEqual({
				selection: {
					start: 2,
					end: 7,
				},
				newValue: "**test1**",
			});
		});
		it("should return an empty italic word", () => {
			expect(
				handleAction({ selection: { start: 0, end: 0 }, action: "ITALIC", value: "test2" }),
			).toStrictEqual({
				selection: {
					start: 1,
					end: 1,
				},
				newValue: "__test2",
			});
		});
		it("should return bold 'test3' word", () => {
			expect(
				handleAction({
					selection: { start: 8, end: 13 },
					action: "BOLD",
					value: "example test3 text",
				}),
			).toStrictEqual({
				selection: {
					start: 10,
					end: 15,
				},
				newValue: "example **test3** text",
			});
		});
		it("should create a new line", () => {
			expect(
				handleAction({
					selection: { start: 14, end: 48 },
					action: "HEADING",
					value: "example test4 this line should be inside header",
				}),
			).toStrictEqual({
				selection: {
					start: 17,
					end: 51,
				},
				newValue: "example test4 \n# this line should be inside header",
			});
		});
		it("should not create a new line", () => {
			expect(
				handleAction({
					selection: { start: 0, end: 34 },
					action: "HEADING",
					value: "test5 this line should be inside header",
				}),
			).toStrictEqual({
				selection: {
					start: 2,
					end: 36,
				},
				newValue: "# test5 this line should be inside header",
			});
		});
	});
});
