import React from 'react';
import { connect } from 'react-redux';

import Layout from '../../../components/layout/Layout';
import questionStyles from '../../../components/questions/allQuestions/allQuestions.module.scss';
import MobileActionButtons from '../../../components/questions/mobileActionButtons/MobileActionButtons';
import QuestionItem from '../../../components/questions/questionsList/questionItem/QuestionItem';
import QuestionsListLayout from '../../../components/questions/questionsListLayout/QuestionsListLayout';
import QuestionsSidebar from '../../../components/questions/questionsSidebar/QuestionsSidebar';
import questionListStyles from '../../../components/questions/selectedQuestions/selectedQuestions.module.scss';
import { ActionCreators } from '../../../redux/actions';
import { AppState } from '../../../redux/reducers/index';
import { redirect } from '../../../utils/redirect';
import type { GetInitialPropsContext } from '../../../utils/types';
import pageStyles from '../../pages.module.scss';

type Props = ReturnType<typeof mapStateToProps>;
const OneQuestionPageComponent = ({ question }: Props) => {
  const questionData = question && !question.error && !question.isLoading ? question.data : null;
  const title = questionData
    ? `Pytanie ${questionData.data.id}: ${questionData.data.question}`
    : '';

  return (
    <Layout title={title}>
      <QuestionsListLayout>
        <div className={pageStyles.questionsContainer}>
          <QuestionsSidebar />
          <section className={questionStyles.appQuestions}>
            <div className={questionListStyles.appQuestionsList}>
              {questionData && (
                <QuestionItem
                  question={questionData.data}
                  selectable={false}
                  editable={false}
                  unselectable={false}
                  selectedQuestionIds={[]}
                  toggleQuestion={() => {
                    /**/
                  }}
                />
              )}
            </div>
          </section>
        </div>
        <MobileActionButtons justDownload={false} />
      </QuestionsListLayout>
    </Layout>
  );
};

OneQuestionPageComponent.getInitialProps = async (ctx: GetInitialPropsContext) => {
  const id = ctx.query && ctx.query.id;
  if (!id || Array.isArray(id)) {
    return redirect('/questions/[technology]', { technology: 'js', page: '1' }, ctx);
  }
  await ctx.store.dispatch(ActionCreators.fetchOneQuestion(ctx));
};

const mapStateToProps = (state: AppState) => {
  return {
    question: state.oneQuestion,
  };
};

const QuestionsPage = connect(mapStateToProps)(OneQuestionPageComponent);
export default QuestionsPage;
