import { describe, expect, it } from "vitest";
import { createQueryHref } from "./LinkWithQuery";

describe("LinkWithQuery", () => {
	describe("createQueryHref", () => {
		it("should return given href and query", () => {
			expect(createQueryHref("test", { q1: "abc", q2: "123" })).toEqual({
				hash: "",
				pathname: "test",
				port: "3000",
				query: { q1: "abc", q2: "123" },
			});
		});
		it("should work with empty href and query", () => {
			expect(createQueryHref("", {})).toEqual({
				hash: "",
				pathname: "",
				query: {},
				port: "3000",
			});
		});
		it("should merge href and query when href is object", () => {
			expect(createQueryHref({ pathname: "test2" }, { q1: "abc", q2: "123" })).toEqual({
				pathname: "test2",
				query: { q1: "abc", q2: "123" },
			});
		});
		it("should merge href and query when href is object and has query inside", () => {
			expect(
				createQueryHref(
					{ pathname: "test3", query: { q1: "href1", q2: "href2", q3: "href3" }, hash: "fragment" },
					{ q0: "query0", q1: "query1", q2: "query2" },
				),
			).toEqual({
				pathname: "test3",
				hash: "fragment",
				query: { q0: "query0", q1: "query1", q2: "query2", q3: "href3" },
			});
		});
		it("should preserve other fields in href", () => {
			expect(createQueryHref({ pathname: "test3", hash: "blablabla" }, {})).toEqual({
				pathname: "test3",
				hash: "blablabla",
				query: {},
			});
		});
		it("should merge queries when href is a string", () => {
			expect(
				createQueryHref("test4?q1=href1&q2=href2&q3=href3#fragment", {
					q0: "query0",
					q1: "query1",
					q2: "query2",
					q3: "href3",
				}),
			).toEqual({
				pathname: "test4",
				hash: "#fragment",
				query: { q0: "query0", q1: "query1", q2: "query2", q3: "href3" },
				port: "3000",
			});
		});
		it("should merge queries when href is a an absolute URL", () => {
			expect(
				createQueryHref("https://google.com/test5?q1=href1&q2=href2&q3=href3#fragment", {
					q0: "query0",
					q1: "query1",
					q2: "query2",
					q3: "href3",
				}),
			).toEqual({
				hash: "#fragment",
				host: "google.com",
				hostname: "google.com",
				href: "https://google.com/test5?q1=href1&q2=href2&q3=href3#fragment",
				pathname: "test5",
				port: "",
				protocol: "https:",
				query: {
					q0: "query0",
					q1: "query1",
					q2: "query2",
					q3: "href3",
				},
			});
		});
	});
});
