import * as React from 'react';
import { GetInitialPropsContext } from '../utils/types';
import { redirect } from '../utils/redirect';
import Layout from '../components/layout/Layout';
import QuestionsListLayout from '../components/questions/questionsListLayout/QuestionsListLayout';

const AdminQuestions = React.lazy(() => import('../components/adminQuestions/AdminQuestions'));

export default class AdminPage extends React.Component {
  static async getInitialProps(ctx: GetInitialPropsContext) {
    const state = ctx.store.getState();
    if (!state.auth.data || !state.auth.data.user.role) {
      return redirect(ctx, '/login', '/admin');
    }
  }

  render() {
    return (
      <Layout title="Admin">
        <QuestionsListLayout>
          <div className="questions-container">
            <AdminQuestions />
          </div>
        </QuestionsListLayout>
      </Layout>
    );
  }
}
