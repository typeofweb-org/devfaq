import { ActionsUnion, createAction } from './types';

export const enum ActionTypes {
  FOO = 'FOO',
}

export const ActionCreators = {
  foo: (text: string) => createAction(ActionTypes.FOO, text),
};

export type Actions = ActionsUnion<typeof ActionCreators>;
