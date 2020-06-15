import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import Layout from '../../components/layout/Layout';
import AllQuestions from '../../components/questions/allQuestions/AllQuestions';
import MobileActionButtons from '../../components/questions/mobileActionButtons/MobileActionButtons';
import QuestionsListLayout from '../../components/questions/questionsListLayout/QuestionsListLayout';
import QuestionsSidebar from '../../components/questions/questionsSidebar/QuestionsSidebar';
import { Technology } from '../../constants/technology-icon-items';
import { ActionCreators, AsyncAction } from '../../redux/actions';
import { AppState } from '../../redux/reducers/index';
import { getTechnology, getSortByArray, getPage } from '../../redux/selectors/selectors';
import { useDidUpdate } from '../../utils/hooks';
import { redirect } from '../../utils/redirect';
import type { GetInitialPropsContext } from '../../utils/types';
import styles from '../pages.module.scss';

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;
const QuestionsPageComponent = ({ technology, selectedLevels, reFetchQuestions }: Props) => {
  const label = technology ? Technology[technology] : '';

  useDidUpdate(() => {
    reFetchQuestions();
  }, [selectedLevels.length]);

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
  return {};
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
