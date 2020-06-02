import React, { useEffect, useCallback } from 'react';
import Layout from '../../components/layout/Layout';
import QuestionsListLayout from '../../components/questions/questionsListLayout/QuestionsListLayout';
import { redirect } from '../../utils/redirect';
import { GetInitialPropsContext } from '../../utils/types';
import QuestionsSidebar from '../../components/questions/questionsSidebar/QuestionsSidebar';
import MobileActionButtons from '../../components/questions/mobileActionButtons/MobileActionButtons';
import AllQuestions from '../../components/questions/allQuestions/AllQuestions';
import { ActionCreators, AsyncAction } from '../../redux/actions';
import { connect } from 'react-redux';
import { AppState } from '../../redux/reducers/index';
import { getTechnology, getSortByArray, getPage } from '../../redux/selectors/selectors';
import { Technology } from '../../constants/technology-icon-items';
import { Dispatch } from 'redux';
import styles from '../pages.module.scss';

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;
const QuestionsPageComponent = ({ technology, selectedLevels, reFetchQuestions }: Props) => {
  const label = technology ? Technology[technology] : '';

  useEffect(() => {
    reFetchQuestions();
  }, [selectedLevels, reFetchQuestions]);

  return (
    <Layout title={`Pytania ${label}`}>
      <QuestionsListLayout>
        <div className={styles.questionsContainer}>
          <QuestionsSidebar />
          <AllQuestions />
        </div>
        <MobileActionButtons justDownload={false} />
      </QuestionsListLayout>
    </Layout>
  );
};

const mapStateToProps = (state: AppState) => {
  return {
    technology: getTechnology(state),
    selectedLevels: state.selectedLevels,
  };
};

QuestionsPageComponent.getInitialProps = async (ctx: GetInitialPropsContext) => {
  if (!ctx.query || !ctx.query.technology || Array.isArray(ctx.query.technology)) {
    return redirect('/questions/[technology]', { technology: 'js', page: '1' }, ctx);
  }

  const state = ctx.store.getState();

  const page = getPage(state);

  if (!page) {
    return redirect(
      '/questions/[technology]',
      { technology: ctx.query.technology, page: '1' },
      ctx
    );
  }
  const sortBy = getSortByArray(state);
  await ctx.store.dispatch(ActionCreators.fetchQuestions(page, sortBy, ctx));
};

const mapDispatchToProps = (
  dispatch: Dispatch<any>,
  _ownProps: ReturnType<typeof mapStateToProps>
) => {
  return {
    reFetchQuestions: (ctx?: GetInitialPropsContext): AsyncAction =>
      dispatch((dispatch, getState) => {
        const state = getState();
        const page = 1;
        const sortBy = getSortByArray(state);
        dispatch(ActionCreators.fetchQuestions(page, sortBy, ctx));
      }),
  };
};

const QuestionsPage = connect(mapStateToProps, mapDispatchToProps)(QuestionsPageComponent);

export default QuestionsPage;
