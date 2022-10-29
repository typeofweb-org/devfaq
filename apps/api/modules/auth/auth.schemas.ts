import { Static, Type } from '@sinclair/typebox';

export const meSchema = Type.Object({
  createdAt: Type.String({ format: 'date-time' }),
  updatedAt: Type.String({ format: 'date-time' }),
  keepMeSignedIn: Type.Boolean(),
  validUntil: Type.String({ format: 'date-time' }),
  _user: Type.Object({
    id: Type.Number(),
    email: Type.String(),
    firstName: Type.Union([Type.String(), Type.Null()]),
    lastName: Type.Union([Type.String(), Type.Null()]),
    _roleId: Type.String(),
    createdAt: Type.String({ format: 'date-time' }),
    updatedAt: Type.String({ format: 'date-time' }),
    socialLogin: Type.Record(Type.String(), Type.Union([Type.String(), Type.Number()])),
  }),
});

export type MeSchema = Static<typeof meSchema>;
