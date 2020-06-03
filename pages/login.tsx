import { GetInitialPropsContext } from '../utils/types';
import React from 'react';
import Layout from '../components/layout/Layout';
import LoginForm from '../components/loginForm/LoginForm';
import { getLoggedInUser } from '../redux/selectors/selectors';
import { redirect, getHrefQueryFromPreviousPath } from '../utils/redirect';

const LoginPage = () => {
  return (
    <Layout title="Logowanie">
      <LoginForm />
    </Layout>
  );
};

LoginPage.getInitialProps = async (ctx: GetInitialPropsContext) => {
  const state = ctx.store.getState();
  if (getLoggedInUser(state)) {
    const query = state.routeDetails.current.query;

    const route = getHrefQueryFromPreviousPath(query && query.previousPath);
    if (!route) {
      return redirect('/', {}, ctx);
    } else {
      return redirect(route.href, route.query, ctx);
    }
  }
};

export default LoginPage;
