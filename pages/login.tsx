import { GetInitialPropsContext } from '../utils/types';
import React from 'react';
import Layout from '../components/layout/Layout';
import LoginForm from '../components/loginForm/LoginForm';
import './index.scss';
import { getLoggedInUser } from '../redux/selectors/selectors';
import { redirect } from '../utils/redirect';

export default class LoginPage extends React.Component {
  static async getInitialProps(ctx: GetInitialPropsContext) {
    const state = ctx.store.getState();
    if (getLoggedInUser(state)) {
      const query = state.routeDetails.current.query;
      const path = (query && String(query.previousPath)) || '/';

      return redirect(path, {}, ctx);
    }
  }

  render() {
    return (
      <Layout title="Logowanie">
        <LoginForm />
      </Layout>
    );
  }
}
