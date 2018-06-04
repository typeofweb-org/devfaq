import { GetInitialPropsContext } from '../utils/types';
import * as React from 'react';
import Layout from '../components/layout/Layout';
import LoginForm from '../components/loginForm/LoginForm';
import './index.scss';

export default class LoginPage extends React.Component {
  static async getInitialProps(_ctx: GetInitialPropsContext) {
    return {};
  }

  render() {
    return (
      <Layout title="Logowanie">
        <LoginForm />
      </Layout>
    );
  }
}
