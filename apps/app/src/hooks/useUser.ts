import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getLoggedInUser, logoutUser } from "../services/users.service";
import { UserData } from "../types";

const USER_QUERY_KEY = ["user"];

export const useUser = () => {
	const queryClient = useQueryClient();
	const { data: userData, ...rest } = useQuery({
		queryKey: USER_QUERY_KEY,
		queryFn: async () => {
			try {
				const { data } = await getLoggedInUser({});

				return data["data"];
			} catch (err) {
				if (err instanceof getLoggedInUser.Error) {
					const { status } = err.getActualType();

					if (status >= 400 && status <= 499) {
						return null;
					}
				}

				throw err;
			}
		},
		staleTime: Infinity,
	});

	const refetchUser = async () => {
		await queryClient.refetchQueries({
			queryKey: USER_QUERY_KEY,
		});

		return queryClient.getQueryData<UserData>(USER_QUERY_KEY);
	};

	const logout = useMutation(logoutUser, {
		onSuccess: () => {
			queryClient.setQueryData(USER_QUERY_KEY, null);
		},
	});

	return { userData, refetchUser, logout, ...rest };
};
