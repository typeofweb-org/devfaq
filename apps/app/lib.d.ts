interface Array<T> {
	includes(searchElement: unknown, fromIndex?: number): searchElement is T;
}

interface ReadonlyArray<T> {
	includes(searchElement: unknown, fromIndex?: number): searchElement is T;
}
