import { Prisma } from "@prisma/client";
import { sessionSelect } from "./auth.js";

export const dbAuthToDto = (db: Prisma.SessionGetPayload<typeof sessionSelect>) => {
	return {
		id: db.id,
		validUntil: db.validUntil.toISOString(),
		keepMeSignedIn: db.keepMeSignedIn,
		createdAt: db.createdAt.toISOString(),
		updatedAt: db.updatedAt.toISOString(),
		_user: {
			id: db.User.id,
			email: db.User.email,
			firstName: db.User.firstName,
			lastName: db.User.lastName,
			_roleId: db.User.UserRole.id,
			createdAt: db.User.createdAt.toISOString(),
			updatedAt: db.User.updatedAt.toISOString(),
			socialLogin: {
				...(db.User.socialLogin as Record<string, string | number>),
			},
		},
	};
};
