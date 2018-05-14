import * as React from 'react';
import * as withReduxType from 'next-redux-wrapper';
import { NextReduxWrappedComponent } from 'next-redux-wrapper';
import { makeStore } from '../redux/store';
import { Provider } from 'react-redux';
//@ts-ignore
import App, { Container } from 'next/app';
import { addRouterEventListener, removeRouterEventListener } from '../utils/routerEvents';
import { withRouter, SingletonRouter } from 'next/router';
import { ActionCreators } from '../redux/actions';
import { RouteDetails, GetInitialPropsContext, AppStore } from '../utils/types';
const AppComponent = App as React.ComponentClass<MyAppProps>;

// hack because of incorrect d.ts file
const withRedux = (withReduxType as any).default as typeof withReduxType;

type AppGetInitialPropsArg = {
  Component: NextReduxWrappedComponent<any>;
  ctx: GetInitialPropsContext;
};

type MyAppProps = {
  Component: React.ComponentType;
  pageProps: object;
  store: AppStore;
  router: SingletonRouter;
};

function updateRoute(routeDetails: RouteDetails, dispatch: AppStore['dispatch']) {
  const { pathname, query, asPath, route } = routeDetails;
  const newRouteDetails: RouteDetails = {
    pathname,
    query,
    asPath,
    route,
  };
  return dispatch(ActionCreators.updateRoute(newRouteDetails));
}

class MyApp extends AppComponent {
  static async getInitialProps({ Component, ctx }: AppGetInitialPropsArg) {
    await updateRoute(ctx, ctx.store.dispatch);
    const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {};

    return { pageProps };
  }

  componentDidMount() {
    addRouterEventListener('onRouteChangeComplete', this.onRouteChange);
  }

  componentWillUnmount() {
    removeRouterEventListener('onRouteChangeComplete', this.onRouteChange);
  }

  onRouteChange = () => {
    updateRoute(this.props.router, this.props.store.dispatch);
  };

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

const options = {
  debug: false,
};

export default withRedux(makeStore, options as any)(
  withRouter(MyApp as React.ComponentType<MyAppProps>)
);
