import { Actions, ActionTypes } from '../actions';
import { RouteDetails } from '../../utils/types';

const initialState: RouteDetails = {
  pathname: '',
  query: {},
  asPath: '',
  route: '',
};

export const routeDetails = (routeDetails = initialState, action: Actions) => {
  switch (action.type) {
    case ActionTypes.UPDATE_ROUTE:
      return {
        ...action.payload,
        query: { ...action.payload.query },
      };
    default:
      return routeDetails;
  }
};
