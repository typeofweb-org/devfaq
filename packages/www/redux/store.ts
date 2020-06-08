import { createWrapper, MakeStore } from 'next-redux-wrapper';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import thunk from 'redux-thunk';

import { reducers, AppState } from './reducers';

const composeEnhancers = composeWithDevTools({
  // options like actionSanitizer, stateSanitizer
});

export const makeStore: MakeStore<AppState> = (context) => {
  const store = createStore(reducers, composeEnhancers(applyMiddleware(thunk)));
  return store;
};

const options = {
  debug: false,
};

export const nextReduxWrapper = createWrapper(makeStore, options);
