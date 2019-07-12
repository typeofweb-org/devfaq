import React from 'react';
import { GetInitialPropsContext } from '../utils/types';
import { redirect } from '../utils/redirect';

export default class Index extends React.Component {
  static async getInitialProps(ctx: GetInitialPropsContext) {
    return redirect(ctx, '/questions/js?page=1');
  }

  render() {
    return null;
  }
}
