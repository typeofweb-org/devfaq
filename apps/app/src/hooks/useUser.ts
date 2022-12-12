import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getLoggedInUser, logoutUser } from "../services/users.service";
import { UserData } from "../types";

const USER_QUERY_KEY = ["user"];

export const useUser = () => {
	const queryClient = useQueryClient();
	const { data: user, ...rest } = useQuery({
		queryKey: USER_QUERY_KEY,
		queryFn: async () => {
			try {
				const { data } = await getLoggedInUser({});

				return data["data"]["_user"];
			} catch (err) {
				return null;
			}
		},
		staleTime: Infinity,
		retry: false,
	});

	const setUser = (user: UserData | null) => {
		queryClient.setQueryData(USER_QUERY_KEY, user);
	};

	const updateLoggedInUser = useMutation(getLoggedInUser, {
		onSuccess: ({ data }) => {
			setUser(data["data"]["_user"]);
		},
	});

	const logout = useMutation(logoutUser, {
		onSuccess: () => {
			setUser(null);
		},
	});

	return { user, updateLoggedInUser, logout, ...rest };
};
