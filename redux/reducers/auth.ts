import { Actions, ActionTypes } from '../actions';

export type UserData = {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  emailAddress: string;
  firstName?: string | null;
  lastName?: string | null;
  role?: string | null;
};

export type AuthData = {
  user: UserData;
};

const intialState: {
  error?: Error;
  data?: AuthData;
  isLoading: boolean;
} = { isLoading: false, data: undefined, error: undefined };

export const auth = (auth = intialState, action: Actions): typeof intialState => {
  switch (action.type) {
    case ActionTypes.LOGIN_STARTED:
      return {
        isLoading: true,
      };
    case ActionTypes.LOGIN_ERROR:
      return {
        isLoading: false,
        error: action.payload,
      };
    case ActionTypes.LOGIN_SUCCESS:
      return {
        isLoading: false,
        data: action.payload,
      };
    default:
      return auth;
  }
};
