import * as React from 'react';
import './index.scss';
import Layout from '../components/layout/Layout';
import QuestionsListLayout from '../components/questions/questionsListLayout/QuestionsListLayout';
import { redirect } from '../utils/redirect';
import { GetInitialPropsContext } from '../utils/types';
import QuestionsSidebar from '../components/questions/questionsSidebar/QuestionsSidebar';
import MobileActionButtons from '../components/questions/mobileActionButtons/MobileActionButtons';
import AllQuestions from '../components/questions/allQuestions/AllQuestions';
import { ActionCreators } from '../redux/actions';

export default class IndexComponent extends React.Component {
  static async getInitialProps(ctx: GetInitialPropsContext) {
    if (!ctx.query || !ctx.query.technology) {
      return redirect(ctx, '/questions/js');
    }

    await ctx.store.dispatch(ActionCreators.fetchQuestions());
  }

  render() {
    return (
      <Layout title="Pytania">
        <QuestionsListLayout>
          <MobileActionButtons justDownload={false} />
          <div className="questions-container">
            <QuestionsSidebar />
            <AllQuestions />
          </div>
        </QuestionsListLayout>
      </Layout>
    );
  }
}
