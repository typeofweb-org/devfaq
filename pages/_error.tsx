import type { NextPageContext, NextComponentType } from 'next';
import NextError, { ErrorProps } from 'next/error';
import React from 'react';

const ErrorPage: NextComponentType<NextPageContext, ErrorProps, ErrorProps> = (props) => {
  return <NextError {...props} />;
};

ErrorPage.getInitialProps = async (ctx) => {
  const { err, pathname, asPath, res } = ctx;
  const statusCode = (res && res.statusCode) || (err && err.statusCode) || 500;

  return { err, pathname, asPath, statusCode };
};

export default ErrorPage;
