import * as Sentry from '@sentry/browser';
import nextReduxWrapper from 'next-redux-wrapper';
import AppComponent, { AppProps, Container } from 'next/app';
import { default as Router, withRouter, SingletonRouter, default as Router } from 'next/router';
import React from 'react';
import { Provider } from 'react-redux';
import React, { useEffect } from 'react';

import { AppModals } from '../components/modals/appModals/AppModals';
import { ActionCreators } from '../redux/actions';
import { nextReduxWrapper, makeStore } from '../redux/store';
import * as analytics from '../utils/analytics';
import env from '../utils/env';
import type { RouteDetails, AppStore } from '../utils/types';

import 'prismjs/themes/prism-coy.css';
import './index.scss';
import { useStore } from 'react-redux';
import { NextPage } from 'next';

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

const MyApp = ({ Component, pageProps, router }: AppProps) => {
  const store = useStore();

  useEffect(() => {
    Router.events.on('routeChangeComplete', onRouteChangeComplete);
    Router.events.on('routeChangeStart', onRouteChangeStart);
    Router.events.on('routeChangeError', onRouteChangeError);
    return () => {
      Router.events.off('routeChangeComplete', onRouteChangeComplete);
      Router.events.off('routeChangeStart', onRouteChangeStart);
      Router.events.off('routeChangeError', onRouteChangeError);
    };
  }, []);

  const onRouteChangeComplete = (url: string) => {
    analytics.reportPageView(url);
    const newRouteDetails = getRouteDetails(router);
    store.dispatch(ActionCreators.updateRouteSuccess(newRouteDetails));
  };

  const onRouteChangeStart = (_url: string) => {
    store.dispatch(ActionCreators.updateRouteStarted());
  };

  const onRouteChangeError = (error: any, _url: string) => {
    store.dispatch(ActionCreators.updateRouteError(error));
  };

<<<<<<< HEAD
  render() {
    const { Component, pageProps } = this.props;
    return (
      <>
        <Component {...pageProps} />
        <AppModals />
      </>
    );
=======
  return (
    <React.Fragment>
      <Component {...pageProps} />
      <AppModals />
    </React.Fragment>
  );
};

MyApp.getInitialProps = async function ({ Component, ctx }: AppContext) {
  if (ctx.req) {
    await ctx.store.dispatch(ActionCreators.validateToken(ctx));
>>>>>>> e727124... ISSUE-8: Changes related to newest version of next-redux-wrapper
  }

  const newRouteDetails = getRouteDetails({ route: '', ...ctx });

  // when changing routes on the client side
  // it's actually still in progress at this point
  const routeChangeInProgress = !ctx.req;
  await ctx.store.dispatch(
    ActionCreators.updateRouteSuccess(newRouteDetails, routeChangeInProgress)
  );

  const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {};

  return { pageProps };
};

export default nextReduxWrapper.withRedux(MyApp);

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
