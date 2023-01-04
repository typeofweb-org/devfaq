/**
 * Add typesafety to computed properties that are unions
 * @param k union of keys `"a" | "b"`
 * @param v value
 * @returns a union of `{ [k]: v }` distributed over `k` but typed correctly
 * @see https://tsplay.dev/m0bxDw
 */
export function kv<K extends PropertyKey, V>(k: K, v: V): { [P in K]: { [Q in P]: V } }[K] {
	return { [k]: v } as never;
}
