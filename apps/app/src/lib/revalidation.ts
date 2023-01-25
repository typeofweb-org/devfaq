export const validatePath = (path: string | string[] | undefined): path is string => {
	return Boolean(path) && typeof path === "string";
};
