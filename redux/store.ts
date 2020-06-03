import nextReduxWrapper from 'next-redux-wrapper';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import thunk from 'redux-thunk';

import type { AppStore } from '../utils/types';

import { reducers, AppState } from './reducers';

const composeEnhancers = composeWithDevTools({
  // options like actionSanitizer, stateSanitizer
});

export const makeStore: nextReduxWrapper.NextStoreCreator<AppState, any, any, any, any> = (
  initialState,
  _options
) => {
  const store = createStore(
    reducers,
    initialState,
    composeEnhancers(applyMiddleware(thunk))
  ) as AppStore;
  return store as any;
};
