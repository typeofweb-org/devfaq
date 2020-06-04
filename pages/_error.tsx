import type { NextPageContext, NextComponentType } from 'next';
import NextError, { ErrorProps } from 'next/error';
import React from 'react';

const ErrorPage: NextComponentType<NextPageContext, ErrorProps, ErrorProps> = (props) => (
  <NextError {...props} />
);

ErrorPage.getInitialProps = (ctx) => {
  const { err, res } = ctx;
  const statusCode = res?.statusCode || err?.statusCode || 500;

  return { statusCode };
};

export default ErrorPage;
