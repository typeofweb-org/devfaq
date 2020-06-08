import type { RouteDetails } from '../../utils/types';
import { Actions, ActionTypes } from '../actions';

interface InitialState {
  previous?: RouteDetails;
  current: RouteDetails;
  isTransitioning: boolean;
  error?: Error;
}

const initialState: InitialState = {
  current: {
    pathname: '',
    query: {},
    asPath: '',
    route: '',
  },
  isTransitioning: false,
};

function copyRouteDetails(r: RouteDetails): RouteDetails {
  return {
    ...r,
    query: { ...r.query },
  };
}

export const routeDetails = (routeDetails = initialState, action: Actions): InitialState => {
  switch (action.type) {
    case ActionTypes.UPDATE_ROUTE_STARTED:
      return {
        ...routeDetails,
        isTransitioning: true,
      };
    case ActionTypes.UPDATE_ROUTE_ERROR:
      return {
        ...routeDetails,
        error: action.payload,
        isTransitioning: false,
      };
    case ActionTypes.UPDATE_ROUTE_SUCCESS:
      return {
        previous: copyRouteDetails(routeDetails.current),
        current: copyRouteDetails(action.payload.route),
        isTransitioning: action.payload.inProgress,
      };
    default:
      return routeDetails;
  }
};
