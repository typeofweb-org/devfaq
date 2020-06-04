import type { NextComponentType } from 'next';
import React from 'react';

import Layout from '../components/layout/Layout';
import LoginForm from '../components/loginForm/LoginForm';
import { getLoggedInUser } from '../redux/selectors/selectors';
import { redirect, getHrefQueryFromPreviousPath } from '../utils/redirect';

const LoginPage: NextComponentType = () => {
  return (
    <Layout title="Logowanie">
      <LoginForm />
    </Layout>
  );
};

LoginPage.getInitialProps = async (ctx) => {
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
