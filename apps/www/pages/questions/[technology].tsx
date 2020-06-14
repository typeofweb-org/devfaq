import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Layout from '../../components/layout/Layout';
import AllQuestions from '../../components/questions/allQuestions/AllQuestions';
import MobileActionButtons from '../../components/questions/mobileActionButtons/MobileActionButtons';
import QuestionsListLayout from '../../components/questions/questionsListLayout/QuestionsListLayout';
import { QuestionsSidebar } from '../../components/questions/questionsSidebar/QuestionsSidebar';
import { Technology, TechnologyKey, SortBy } from '../../constants/technology-icon-items';
import { ActionCreators } from '../../redux/actions';
import { getSortByArray, getPage } from '../../redux/selectors/selectors';
import { redirect } from '../../utils/redirect';
import type { GetInitialPropsContext } from '../../utils/types';
import { useQuestionsFilter } from '../../utils/useFilter';
import styles from '../pages.module.scss';
import { useDidUpdate } from '../../utils/hooks';
import { selectedLevels } from '../../redux/reducers/selectedLevels';
import { LevelKey } from '../../constants/level';

const QuestionsPage: NextPage = () => {
  const dispatch = useDispatch();

  const filter = useQuestionsFilter();

  const { page, technology, selectedLevels, sortBy } = filter.selected;

  const label = technology ? Technology[technology] : '';

  useDidUpdate(() => {
    console.log('FETCHING');
    dispatch(ActionCreators.fetchQuestions2({ page, technology, selectedLevels, sortBy }));
  }, [dispatch, selectedLevels]);

  return (
    <Layout title={`Pytania ${label}`}>
      <QuestionsListLayout>
        <div className={styles.questionsContainer}>
          <QuestionsSidebar />
          <button onClick={() => filter.updateFilter({})}>KLIK</button>
          <AllQuestions />
        </div>
        <MobileActionButtons justDownload={false} />
      </QuestionsListLayout>
    </Layout>
  );
};

QuestionsPage.getInitialProps = async (ctx: GetInitialPropsContext) => {
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
  const sortBy = (typeof ctx.query.sortBy === 'string'
    ? ctx.query.sortBy.split(/[,*]/)
    : ['acceptedAt', 'desc']) as SortBy;
  await ctx.store.dispatch(
    ActionCreators.fetchQuestions2(
      {
        page,
        sortBy,
        technology: ctx.query.technology as TechnologyKey,
        selectedLevels:
          typeof ctx.query.selectedLevels === 'string'
            ? (ctx.query.selectedLevels.split(',') as LevelKey[])
            : undefined,
      },
      ctx
    )
  );
  return {};
};

export default QuestionsPage;
