import nextReduxWrapper, { createWrapper, MakeStore } from 'next-redux-wrapper';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import thunk from 'redux-thunk';

import type { AppStore } from '../utils/types';

import { reducers, AppState } from './reducers';

const composeEnhancers = composeWithDevTools({
  // options like actionSanitizer, stateSanitizer
});

export const makeStore: MakeStore = (context) => {
  const store = createStore(reducers, composeEnhancers(applyMiddleware(thunk))) as AppStore;
  return store as any;
};

const options = {
  debug: false,
};

export const nextReduxWrapper = createWrapper(makeStore, options);
