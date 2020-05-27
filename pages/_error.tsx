import React from 'react';
import NextError, { ErrorProps } from 'next/error';
import { NextPageContext } from 'next';
import { redirect } from '../utils/redirect';

export default class Error extends React.Component<ErrorProps> {
  static async getInitialProps(ctx: NextPageContext) {
    const { err, pathname, asPath, res } = ctx;
    const statusCode = res ? res.statusCode : err ? err.statusCode : null;

    // if (statusCode === 404) {
    //   if (asPath && asPath.endsWith('/')) {
    //     const newAsPath = asPath.slice(0, asPath.length - 1);
    //     if (newAsPath !== asPath) {
    //       return redirect(newAsPath, {}, ctx);
    //     }
    //   }
    //   return redirect('/', {}, ctx);
    // }
    return { err, pathname, asPath, statusCode };
  }
  render() {
    return <NextError {...this.props} />;
  }
}
