import { composeWithDevTools } from 'redux-devtools-extension/logOnlyInProduction';
import { NextStoreCreator } from 'next-redux-wrapper';
import { createStore, Store } from 'redux';
import { reducers } from './reducers';
import { AppState } from './reducers/index';

const composeEnhancers = composeWithDevTools({
  // options like actionSanitizer, stateSanitizer
});

export const makeStore: NextStoreCreator<AppState, any, any, any, any> = (
  initialState,
  _options
) => {
  const store = createStore(reducers, initialState, composeEnhancers()) as Store<AppState>;
  return store;
};
