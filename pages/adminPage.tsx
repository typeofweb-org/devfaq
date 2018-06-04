import * as React from 'react';
import { GetInitialPropsContext } from '../utils/types';
import { redirect } from '../utils/redirect';
import Layout from '../components/layout/Layout';

export default class AdminPage extends React.Component {
  static async getInitialProps(ctx: GetInitialPropsContext) {
    const state = ctx.store.getState();
    if (!state.auth.data || !state.auth.data.user.role) {
      return redirect(ctx, '/login');
    }
  }

  render() {
    return (
      <Layout title="Admin">
        <div className="container">aaa</div>
      </Layout>
    );
  }
}
