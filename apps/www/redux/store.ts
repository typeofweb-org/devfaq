import withRedux, { MakeStore } from 'next-redux-wrapper';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import thunk from 'redux-thunk';

import { reducers } from './reducers';

const composeEnhancers = composeWithDevTools({
  // options like actionSanitizer, stateSanitizer
});

export const makeStore: MakeStore = (initialState, ctx) => {
  const store = createStore(reducers, initialState, composeEnhancers(applyMiddleware(thunk)));
  return store;
};

const options = {
  debug: false,
};

export const nextReduxWrapper = withRedux(makeStore, options);
