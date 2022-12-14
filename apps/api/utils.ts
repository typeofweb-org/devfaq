export function kv<K extends PropertyKey, V>(k: K, v: V): { [P in K]: { [Q in P]: V } }[K] {
	return { [k]: v } as never;
}
