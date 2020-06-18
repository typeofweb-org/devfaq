import * as Sentry from '@sentry/node';
import { NextPageContext } from 'next';
import NextErrorComponent, { ErrorProps } from 'next/error';
import React from 'react';

import { AppState } from '../redux/reducers';

type PromiseValue<T extends Promise<any>> = T extends Promise<infer R> ? R : T;

const MyError = (ctx: PromiseValue<ReturnType<typeof getInitialProps>> & NextPageContext) => {
  if (!('hasGetInitialPropsRun' in ctx && ctx.hasGetInitialPropsRun) && ctx.err) {
    // getInitialProps is not called in case of
    // https://github.com/vercel/next.js/issues/8592. As a workaround, we pass
    // err via _app.js so it can be captured
    const state = ctx.store.getState() as AppState;
    const id = state.auth.data?.session._userId;
    const email = state.auth.data?.session._user.email;
    if (id) {
      Sentry.configureScope((scope) => {
        scope.setUser({
          id: String(id),
          email,
        });
        Sentry.captureException(ctx.err);
      });
    } else {
      Sentry.captureException(ctx.err);
    }
  }

  return <NextErrorComponent statusCode={ctx.statusCode} />;
};

const getInitialProps = async (ctx: NextPageContext) => {
  const errorInitialProps = await NextErrorComponent.getInitialProps(ctx);

  if (ctx.res?.statusCode === 404) {
    // Opinionated: do not record an exception in Sentry for 404
    return { statusCode: 404 };
  }
  if (ctx.err) {
    Sentry.captureException(ctx.err);
    return errorInitialProps;
  }

  // If this point is reached, getInitialProps was called without any
  // information about what the error might be. This is unexpected and may
  // indicate a bug introduced in Next.js, so record it in Sentry
  Sentry.captureException(
    new Error(`_error.js getInitialProps missing data at path: ${ctx.asPath}`)
  );

  return {
    ...errorInitialProps,
    // Workaround for https://github.com/vercel/next.js/issues/8592, mark when
    // getInitialProps has run
    hasGetInitialPropsRun: true,
  };
};

MyError.getInitialProps = getInitialProps;

export default MyError;
