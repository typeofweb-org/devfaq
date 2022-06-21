import { Static, Type } from '@sinclair/typebox';

export const meSchema = Type.Object({
  id: Type.String(),
  validUntil: Type.String({ format: 'date-time' }),
  keepMeSignedIn: Type.Boolean(),
  User: Type.Object({
    id: Type.Number(),
    email: Type.String(),
    firstName: Type.Union([Type.String(), Type.Null()]),
    lastName: Type.Union([Type.String(), Type.Null()]),
    socialLogin: Type.Union([
      Type.Null(),
      Type.Record(Type.String(), Type.Union([Type.String(), Type.Number()])),
    ]),
    UserRole: Type.Object({
      id: Type.String(),
    }),
  }),
});
export type MeSchema = Static<typeof meSchema>;
