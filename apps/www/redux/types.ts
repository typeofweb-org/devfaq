import { ActionCreatorsMapObject } from 'redux';

interface Action<T> {
  type: T;
}

export type ActionsUnion<A extends ActionCreatorsMapObject> = ReturnType<A[keyof A]>;

export interface ActionWithPayload<T extends string, P> extends Action<T> {
  payload: P;
}

export function createAction<T extends string>(type: T): Action<T>;
export function createAction<T extends string, P>(type: T, payload: P): ActionWithPayload<T, P>;
export function createAction<T extends string, P>(type: T, payload?: P) {
  if (typeof payload === 'undefined') {
    return { type };
  } else {
    return { type, payload };
  }
}
