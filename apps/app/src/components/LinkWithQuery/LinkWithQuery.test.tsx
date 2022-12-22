import { describe, expect, it } from "vitest";
import { createQueryHref } from "./LinkWithQuery";

describe("LinkWithQuery", () => {
	describe("createQueryHref", () => {
		it("should return given href and query", () => {
			expect(createQueryHref("test", { q1: "abc", q2: "123" })).toEqual("test?q1=abc&q2=123");
		});

		it("should work with empty href and query", () => {
			expect(createQueryHref("", {})).toEqual("");
		});

		it("should merge href and query when href is object", () => {
			expect(createQueryHref({ pathname: "test2" }, { q1: "abc", q2: "123" })).toEqual(
				"/test2?q1=abc&q2=123",
			);
		});

		it("should merge href and query when href is object and has query inside", () => {
			expect(
				createQueryHref(
					{ pathname: "test3", query: { q1: "href1", q2: "href2", q3: "href3" }, hash: "fragment" },
					{ q0: "query0", q1: "query1", q2: "query2" },
				),
			).toEqual("/test3?q1=href1&q2=href2&q3=href3&q0=query0#fragment");
		});

		it("should preserve other fields in href", () => {
			expect(createQueryHref({ pathname: "test3", hash: "blablabla" }, {})).toEqual(
				"/test3#blablabla",
			);
		});

		it("should merge queries when href is a string", () => {
			expect(
				createQueryHref("test4?q1=href1&q2=href2&q3=href3#fragment", {
					q0: "query0",
					q1: "query1",
					q2: "query2",
					q3: "href3",
				}),
			).toEqual("test4?q1=href1&q2=href2&q3=href3&q0=query0#fragment");
		});

		it("should merge queries when href is an absolute URL", () => {
			expect(
				createQueryHref("https://google.com/test5?q1=href1&q2=href2&q3=href3#fragment", {
					q0: "query0",
					q1: "query1",
					q2: "query2",
					q3: "href3",
				}),
			).toEqual("https://google.com/test5?q1=href1&q2=href2&q3=href3&q0=query0#fragment");
		});

		it("should override existing params", () => {
			expect(
				createQueryHref("test?a=b&foo=bar", {
					a: "b",
					foo: "baz",
				}),
			).toEqual("test?a=b&foo=bar");
		});
	});
});
