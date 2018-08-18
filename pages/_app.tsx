import * as React from 'react';
// if (process.env.NODE_ENV !== 'production') {
//   const { whyDidYouUpdate } = require('why-did-you-update');
//   whyDidYouUpdate(React, {
//     exclude: [/^withRouter/, /^Connect/, /^Provider$/, /^AppComponent$/, /^TransitionGroup$/, /^CSSTransition$/],
//   });
// }

import nextReduxWrapper from 'next-redux-wrapper';
import { makeStore } from '../redux/store';
import { Provider } from 'react-redux';
// @ts-ignore
import App, { Container } from 'next/app';
import { addRouterEventListener, removeRouterEventListener } from '../utils/routerEvents';
import { withRouter, SingletonRouter } from 'next/router';
import { ActionCreators } from '../redux/actions';
import { RouteDetails, GetInitialPropsContext, AppStore } from '../utils/types';
import AppModals from '../components/modals/appModals/AppModals';
const AppComponent = App as React.ComponentClass<MyAppProps>;
AppComponent.displayName = 'AppComponent';
import * as analytics from '../utils/analytics';

interface AppGetInitialPropsArg {
  Component: nextReduxWrapper.NextReduxWrappedComponent<any>;
  ctx: GetInitialPropsContext;
}

interface MyAppProps {
  Component: React.ComponentType;
  pageProps: object;
  store: AppStore;
  router: SingletonRouter;
}

function getRouteDetails(routeDetails: RouteDetails) {
  const { pathname, query, asPath, route } = routeDetails;
  const newRouteDetails: RouteDetails = {
    pathname,
    query: { ...query },
    asPath,
    route,
  };
  return newRouteDetails;
}

class MyApp extends AppComponent {
  static async getInitialProps({ Component, ctx }: AppGetInitialPropsArg) {
    if (ctx.isServer) {
      await ctx.store.dispatch(ActionCreators.validateToken(ctx));
    }

    const newRouteDetails = getRouteDetails(ctx);

    // when changing routes on the client side
    // it's actually still in progress at this point
    const routeChangeInProgress = !ctx.isServer;
    await ctx.store.dispatch(
      ActionCreators.updateRouteSuccess(newRouteDetails, routeChangeInProgress)
    );

    const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {};

    return { pageProps };
  }

  componentDidMount() {
    addRouterEventListener('onRouteChangeComplete', this.onRouteChangeComplete);
    addRouterEventListener('onRouteChangeStart', this.onRouteChangeStart);
    addRouterEventListener('onRouteChangeError', this.onRouteChangeError);
  }

  componentWillUnmount() {
    removeRouterEventListener('onRouteChangeComplete', this.onRouteChangeComplete);
    removeRouterEventListener('onRouteChangeStart', this.onRouteChangeStart);
    removeRouterEventListener('onRouteChangeError', this.onRouteChangeError);
  }

  onRouteChangeComplete = (url: string) => {
    analytics.reportPageView(url);
    const newRouteDetails = getRouteDetails(this.props.router);
    this.props.store.dispatch(ActionCreators.updateRouteSuccess(newRouteDetails));
  };

  onRouteChangeStart = (_url: string) => {
    this.props.store.dispatch(ActionCreators.updateRouteStarted());
  };

  onRouteChangeError = (error: any, _url: string) => {
    this.props.store.dispatch(ActionCreators.updateRouteError(error));
  };

  render() {
    const { Component, pageProps, store } = this.props;
    return (
      <Container>
        <Provider store={store}>
          <React.Fragment>
            <Component {...pageProps} />
            <AppModals />
          </React.Fragment>
        </Provider>
      </Container>
    );
  }
}

const options = {
  debug: false,
};

export default nextReduxWrapper(makeStore, options)(
  withRouter(MyApp as React.ComponentType<MyAppProps>)
);

if (typeof window !== 'undefined') {
  // @ts-ignore
  window.globalReportEvent = (
    action: string,
    category: string,
    label?: string,
    questionId?: number | string
  ) => {
    console.log('action', action, 'category', category, 'label', label, 'questionId', questionId);
  };
} else {
  // @ts-ignore
  global.globalReportEvent = (
    action: string,
    category: string,
    label?: string,
    questionId?: number | string
  ) => {
    console.log('action', action, 'category', category, 'label', label, 'questionId', questionId);
  };
}
