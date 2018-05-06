import { foo } from './foo';
import { combineReducers } from 'redux';

const reducersObj = {
  foo,
};
export const reducers = combineReducers(reducersObj as any);

export type AppState = { [K in keyof typeof reducersObj]: ReturnType<typeof reducersObj[K]> };
