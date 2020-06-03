import { HYDRATE } from 'next-redux-wrapper';
import { route } from 'next/dist/next-server/server/router';
import { combineReducers } from 'redux';

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

export const reducers = (state: any, action: any) => {
  if (action.type === HYDRATE) {
    const hydrateState = action.payload;
    // hydrateState.routeDetails = !state.routeDetails.pathname
    //   ? hydrateState.routeDetails
    //   : state.routeDetails;

    const nextState = {
      ...state, // use previous state
      ...hydrateState, // apply delta from hydration
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
