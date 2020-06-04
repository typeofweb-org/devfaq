import * as Sentry from '@sentry/browser';
import nextReduxWrapper from 'next-redux-wrapper';
import AppComponent, { AppContext } from 'next/app';
import { default as Router } from 'next/router';
import React from 'react';
import { Provider } from 'react-redux';

import { AppModals } from '../components/modals/appModals/AppModals';
import { ActionCreators } from '../redux/actions';
import { makeStore } from '../redux/store';
import * as analytics from '../utils/analytics';
import env from '../utils/env';
import type { RouteDetails, AppStore } from '../utils/types';

import 'prismjs/themes/prism-coy.css';
import './index.scss';

type WebVitalsReport =
  | {
      id: string;
      name: 'CLS' | 'TTFB';
      label: 'web-vital';
      value: number;
    }
  | {
      id: string;
      name: 'Next.js-hydration';
      label: 'custom';
      value: number;
    };

export function reportWebVitals({ id, name, label, value }: WebVitalsReport) {
  // These metrics can be sent to any analytics service
  console.log({ id, name, label, value });
  gtag('event', name, {
    event_category: label === 'web-vital' ? 'Web Vitals' : 'Next.js custom metric',
    event_label: id,
    value: Math.round(name === 'CLS' ? value * 1000 : value),
    non_interaction: true,
  });
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

class MyApp extends AppComponent<{ store: AppStore; ctx: RouteDetails }> {
  static async getInitialProps({ Component, ctx }: AppContext) {
    if (ctx.req) {
      await ctx.store.dispatch(ActionCreators.validateToken(ctx));
    }

    const newRouteDetails = getRouteDetails(ctx);

    // when changing routes on the client side
    // it's actually still in progress at this point
    const routeChangeInProgress = !ctx.req;
    await ctx.store.dispatch(
      ActionCreators.updateRouteSuccess(newRouteDetails, routeChangeInProgress)
    );

    const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {};

    return { pageProps };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo & Record<string, any>) {
    console.log('CUSTOM ERROR HANDLING', error);
    // This is needed to render errors correctly in development / production
    super.componentDidCatch(error, errorInfo);
  }

  componentDidMount() {
    Router.events.on('routeChangeComplete', this.onRouteChangeComplete);
    Router.events.on('routeChangeStart', this.onRouteChangeStart);
    Router.events.on('routeChangeError', this.onRouteChangeError);
  }

  componentWillUnmount() {
    Router.events.off('routeChangeComplete', this.onRouteChangeComplete);
    Router.events.off('routeChangeStart', this.onRouteChangeStart);
    Router.events.off('routeChangeError', this.onRouteChangeError);
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
      <Provider store={store}>
        <>
          <Component {...pageProps} />
          <AppModals />
        </>
      </Provider>
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
  const isDev = env.NODE_ENV !== 'production';
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
