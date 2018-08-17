import * as React from 'react';
import { GetInitialPropsContext } from '../utils/types';
import { redirect } from '../utils/redirect';
import Layout from '../components/layout/Layout';
import QuestionsListLayout from '../components/questions/questionsListLayout/QuestionsListLayout';
import QuestionsSidebar from '../components/questions/questionsSidebar/QuestionsSidebar';
import AllQuestions from '../components/questions/allQuestions/AllQuestions';

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
        <QuestionsListLayout>
          <div className="questions-container">
            <QuestionsSidebar />
            <AllQuestions />
          </div>
        </QuestionsListLayout>
      </Layout>
    );
  }
}
