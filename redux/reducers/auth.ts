import { Actions, ActionTypes } from '../actions';

export interface UserData {
  id: number;
  email: string;
  createdAt: string;
  updatedAt: string;
  _roleId: string;
  firstName?: string | null;
  lastName?: string | null;
  socialLogin?: {
    github?: number;
  } | null;
}

export type SessionData = {
  keepMeSignedIn: boolean;
  validUntil: string;
  createdAt: string;
  updatedAt: string;
  version: number;
  _userId: number;
  _user: UserData;
};

export interface AuthData {
  session: SessionData;
}

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
