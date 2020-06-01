import React from 'react';
import Layout from '../../../components/layout/Layout';
import QuestionsListLayout from '../../../components/questions/questionsListLayout/QuestionsListLayout';
import { redirect } from '../../../utils/redirect';
import { GetInitialPropsContext } from '../../../utils/types';
import QuestionsSidebar from '../../../components/questions/questionsSidebar/QuestionsSidebar';
import MobileActionButtons from '../../../components/questions/mobileActionButtons/MobileActionButtons';
import { ActionCreators } from '../../../redux/actions';
import { connect } from 'react-redux';
import { AppState } from '../../../redux/reducers/index';
import QuestionItem from '../../../components/questions/questionsList/questionItem/QuestionItem';
import pageStyles from '../../pages.module.scss';
import questionStyles from '../../../components/questions/allQuestions/allQuestions.module.scss';
import questionListStyles from '../../../components/questions/selectedQuestions/selectedQuestions.module.scss';

type Props = ReturnType<typeof mapStateToProps>;
class OneQuestionPageComponent extends React.Component<Props> {
  static async getInitialProps(ctx: GetInitialPropsContext) {
    const id = ctx.query && ctx.query.id;

    if (!id || Array.isArray(id)) {
      return redirect('/questions/[technology]', { technology: 'js', page: '1' }, ctx);
    }

    await ctx.store.dispatch(ActionCreators.fetchOneQuestion(ctx));
  }

  render() {
    const { question } = this.props;
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
  }
}

const mapStateToProps = (state: AppState) => {
  return {
    question: state.oneQuestion,
  };
};

const QuestionsPage = connect(mapStateToProps)(OneQuestionPageComponent);
export default QuestionsPage;
