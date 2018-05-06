import { Actions, ActionTypes } from '../actions';

export const foo = (foo = '', action: Actions) => {
  switch (action.type) {
    case ActionTypes.FOO:
      return action.payload;
    default:
      return foo;
  }
};
