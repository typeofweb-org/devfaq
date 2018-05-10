import * as React from 'react';
import { Store } from 'redux';
import * as withReduxType from 'next-redux-wrapper';
import { NextReduxWrappedComponent } from 'next-redux-wrapper';
import { makeStore } from '../redux/store';
import { AppState } from '../redux/reducers/index';
import { Provider } from 'react-redux';
//@ts-ignore
import App, { Container } from 'next/app';
const AppComponent = App as React.ComponentClass<MyAppProps>;

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
  store: Store;
};

class MyApp extends AppComponent {
  static async getInitialProps({ Component, ctx }: AppGetInitialPropsArg) {
    // await ctx.store.dispatch(ActionCreators.foo('some text'));

    const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {};

    return { pageProps };
  }

  render() {
    const { Component, pageProps, store } = this.props;
    return (
      <Container>
        <Provider store={store}>
          <Component {...pageProps} />
        </Provider>
      </Container>
    );
  }
}
type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;
const options: Omit<withReduxType.Options<AppState, any, any, any, any>, 'createStore'> = {
  debug: false,
};

export default withRedux(makeStore, options as any)(MyApp as React.ComponentType<MyAppProps>);
