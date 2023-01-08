/* eslint-disable import/export */
// https://github.com/DefinitelyTyped/DefinitelyTyped/issues/60924#issuecomment-1358837996

declare global {
	export const { fetch, FormData, Headers, Request, Response }: typeof import("undici");
	export type { FormData, Headers, Request, RequestInit, Response } from "undici";
}

export {};
