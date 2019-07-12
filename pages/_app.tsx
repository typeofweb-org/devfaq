import React from 'react';
// if (env.NODE_ENV !== 'production') {
//   const { whyDidYouUpdate } = require('why-did-you-update');
//   whyDidYouUpdate(React, {
//     exclude: [/^withRouter/, /^Connect/, /^Provider$/, /^AppComponent$/, /^TransitionGroup$/, /^CSSTransition$/],
//   });
// }

import nextReduxWrapper from 'next-redux-wrapper';
import { makeStore } from '../redux/store';
import { Provider } from 'react-redux';
import AppComponent, { Container, AppContext } from 'next/app';
import { withRouter, SingletonRouter, default as Router } from 'next/router';
import { ActionCreators } from '../redux/actions';
import { RouteDetails, GetInitialPropsContext, AppStore } from '../utils/types';
import AppModals from '../components/modals/appModals/AppModals';
import * as analytics from '../utils/analytics';
import * as Sentry from '@sentry/browser';
import env from '../utils/env';

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

Router.events.on('onRouteChangeComplete', (...args) => console.log('onRouteChangeComplete', args));
Router.events.on('onRouteChangeStart', (...args) => console.log('onRouteChangeStart', args));
Router.events.on('onRouteChangeError', (...args) => console.log('onRouteChangeError', args));

class MyApp extends AppComponent<{ store: AppStore }> {
  static async getInitialProps({ Component, ctx }: AppContext) {
    console.log('getInitialProps');
    if (ctx.req) {
      await ctx.store.dispatch(ActionCreators.validateToken(ctx));
    }

    // const newRouteDetails = getRouteDetails(ctx);
    console.log(Router.router);

    // // when changing routes on the client side
    // // it's actually still in progress at this point
    // const routeChangeInProgress = !ctx.req;
    // await ctx.store.dispatch(
    //   ActionCreators.updateRouteSuccess(newRouteDetails, routeChangeInProgress)
    // );

    const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {};

    return { pageProps };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo & Record<string, any>) {
    console.log('CUSTOM ERROR HANDLING', error);
    // This is needed to render errors correctly in development / production
    if (super.componentDidCatch) {
      super.componentDidCatch(error, errorInfo);
    }
  }

  componentDidMount() {
    console.log('componentDidMount');
    Router.router.events.on('onRouteChangeComplete', (...args) =>
      console.log('onRouteChangeComplete', args)
    );
    Router.router.events.on('onRouteChangeStart', (...args) =>
      console.log('onRouteChangeStart', args)
    );

    Router.events.on('onRouteChangeComplete', (...args) =>
      console.log('onRouteChangeComplete', args)
    );
    Router.events.on('onRouteChangeStart', (...args) => console.log('onRouteChangeStart', args));
    Router.events.on('onRouteChangeError', (...args) => console.log('onRouteChangeError', args));
    Router.events.on('onRouteChangeComplete', this.onRouteChangeComplete);
    Router.events.on('onRouteChangeStart', this.onRouteChangeStart);
    Router.events.on('onRouteChangeError', this.onRouteChangeError);
  }

  componentWillUnmount() {
    // Router.events.off('onRouteChangeComplete', this.onRouteChangeComplete);
    // Router.events.off('onRouteChangeStart', this.onRouteChangeStart);
    // Router.events.off('onRouteChangeError', this.onRouteChangeError);
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

export default nextReduxWrapper(makeStore, options)(MyApp);

if (typeof window !== 'undefined') {
  // @ts-ignore
  window.globalReportEvent = analytics.reportEvent;
  const isDev = env.NODE_ENV !== 'production' && env.NODE_ENV !== 'staging';
  Sentry.init({ dsn: env.SENTRY_DSN, debug: isDev });
} else {
  // @ts-ignore
  global.globalReportEvent = (
    _action: string,
    _category: string,
    _label?: string,
    _questionId?: number | string
  ) => {
    // console.log('action', action, 'category', category, 'label', label, 'questionId', questionId);
  };
}
