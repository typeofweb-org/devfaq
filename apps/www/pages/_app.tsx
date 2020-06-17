import * as Sentry from '@sentry/node';
import { ReduxWrapperAppProps } from 'next-redux-wrapper';
import App, { AppContext } from 'next/app';
import Router from 'next/router';
import React, { useEffect, useCallback } from 'react';
import { Provider } from 'react-redux';

import { ErrorBoundary } from '../components/errorBoundary/ErrorBoundary';
import { AppModals } from '../components/modals/appModals/AppModals';
import { ActionCreators } from '../redux/actions';
import { AppState } from '../redux/reducers';
import { nextReduxWrapper } from '../redux/store';
import * as analytics from '../utils/analytics';
import env from '../utils/env';
import type { RouteDetails } from '../utils/types';

import 'prismjs/themes/prism-coy.css';
import './index.scss';

const isDev = env.NODE_ENV !== 'production';
Sentry.init({
  dsn: env.SENTRY_DSN,
  debug: isDev,
  environment: env.ENV,
  release: env.SENTRY_VERSION,
});

type WebVitalsReport =
  | {
      id?: string;
      name?: 'TTFB' | 'FCP' | 'LCP' | 'FID' | 'CLS';
      label?: 'web-vital';
      value?: number;
    }
  | {
      id?: string;
      name?: 'Next.js-hydration' | 'Next.js-route-change-to-render' | 'Next.js-render';
      label?: 'custom';
      value?: number;
    };

export function reportWebVitals({ id, name, label, value = 1 }: WebVitalsReport = {}) {
  // These metrics can be sent to any analytics service
  console.log({ id, name, label, value });
  if (!id || !name) {
    return;
  }
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

const MyApp = ({
  Component,
  pageProps,
  router,
  store,
  err,
}: ReduxWrapperAppProps<AppState> & { err: any }) => {
  const onRouteChangeComplete = useCallback(
    (url: string) => {
      analytics.reportPageView(url);
      const newRouteDetails = getRouteDetails(router);
      store.dispatch(ActionCreators.updateRouteSuccess(newRouteDetails));
    },
    [router, store]
  );

  const onRouteChangeStart = useCallback(
    (_url: string) => {
      store.dispatch(ActionCreators.updateRouteStarted());
    },
    [store]
  );

  const onRouteChangeError = useCallback(
    (error: any, _url: string) => {
      store.dispatch(ActionCreators.updateRouteError(error));
    },
    [store]
  );

  useEffect(() => {
    Router.events.on('routeChangeComplete', onRouteChangeComplete);
    Router.events.on('routeChangeStart', onRouteChangeStart);
    Router.events.on('routeChangeError', onRouteChangeError);
    return () => {
      Router.events.off('routeChangeComplete', onRouteChangeComplete);
      Router.events.off('routeChangeStart', onRouteChangeStart);
      Router.events.off('routeChangeError', onRouteChangeError);
    };
  }, [onRouteChangeComplete, onRouteChangeError, onRouteChangeStart]);

  return (
    <ErrorBoundary>
      <Provider store={store}>
        <Component {...pageProps} err={err} />
        <AppModals />
      </Provider>
    </ErrorBoundary>
  );
};

MyApp.getInitialProps = async function (appContext: AppContext) {
  const { ctx } = appContext;
  if (ctx.req) {
    await ctx.store.dispatch(ActionCreators.validateToken(ctx));
  }

  const newRouteDetails = getRouteDetails({ route: '', ...ctx });

  // when changing routes on the client side
  // it's actually still in progress at this point
  const routeChangeInProgress = !ctx.req;
  await ctx.store.dispatch(
    ActionCreators.updateRouteSuccess(newRouteDetails, routeChangeInProgress)
  );

  const pageProps = await App.getInitialProps(appContext);

  return { pageProps };
};

const WrapperApp = nextReduxWrapper(MyApp);
export default WrapperApp;

if (typeof window !== 'undefined') {
  // @ts-ignore
  window.globalReportEvent = analytics.reportEvent;
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
