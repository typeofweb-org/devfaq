import * as React from 'react';
import { Store } from 'redux';
import * as withReduxType from 'next-redux-wrapper';
import { NextReduxWrappedComponent } from 'next-redux-wrapper';
import { makeStore } from '../redux/store';
import { ActionCreators } from '../redux/actions';
import { AppState } from '../redux/reducers/index';

// hack because of incorrect d.ts file
const withRedux = (withReduxType as any).default as typeof withReduxType;

type MyAppContext = {
  store: Store<AppState>;
};

type AppGetInitialPropsArg = {
  Component: NextReduxWrappedComponent<any>;
  ctx: MyAppContext;
};

type MyAppProps = {
  Component: React.ComponentType;
  pageProps: object;
};

class MyApp extends React.Component<MyAppProps> {
  static async getInitialProps({ Component, ctx }: AppGetInitialPropsArg) {
    await ctx.store.dispatch(ActionCreators.foo('some text'));

    const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {};

    return { pageProps };
  }

  render() {
    const { Component, pageProps } = this.props;
    return <Component {...pageProps} />;
  }
}
type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;
const options: Omit<withReduxType.Options<AppState, any, any, any, any>, 'createStore'> = {
  debug: true,
};
// @todo update next-redux-wrapper definitions
export default withRedux(makeStore, options as any)(MyApp);
