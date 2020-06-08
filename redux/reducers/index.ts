import { HYDRATE } from 'next-redux-wrapper';
import { route } from 'next/dist/next-server/server/router';
import { combineReducers, AnyAction, Reducer } from 'redux';

import { auth } from './auth';
import { oneQuestion } from './oneQuestion';
import { questions } from './questions';
import { routeDetails } from './routeDetails';
import { selectedLevels } from './selectedLevels';
import { selectedQuestions } from './selectedQuestions';
import { ui } from './ui';

const reducersObj = {
  questions,
  oneQuestion,
  selectedQuestions,
  ui,
  selectedLevels,
  routeDetails,
  auth,
};
export const combinedReducer = combineReducers(reducersObj);

export const reducers: Reducer<AppState, AnyAction> = (state, action) => {
  if (action.type === HYDRATE) {
    const hydrateState = action.payload;

    const nextState = {
      ...hydrateState,
      ...state,
      routeDetails: {
        ...state?.routeDetails,
        ...hydrateState.routeDetails,
        isTransitioning: state?.routeDetails.isTransitioning,
      },
    };
    return nextState;
  } else {
    return combinedReducer(state, action);
  }
};

export type AppState = { [K in keyof typeof reducersObj]: ReturnType<typeof reducersObj[K]> };

declare module 'react-redux' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultRootState extends AppState {}
}
