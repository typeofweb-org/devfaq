import dynamic from 'next/dynamic';
import React from 'react';

import Layout from '../components/layout/Layout';
import QuestionsListLayout from '../components/questions/questionsListLayout/QuestionsListLayout';
import { getLoggedInUser } from '../redux/selectors/selectors';
import { redirect, getPreviousPathFromHrefQuery } from '../utils/redirect';
import type { GetInitialPropsContext } from '../utils/types';

import styles from './pages.module.scss';

const AdminQuestions = dynamic(() =>
  import(/* webpackChunkName: "AdminQuestions" */ '../components/adminQuestions/AdminQuestions')
);

const AdminPage = () => {
  return (
    <Layout title="Admin">
      <QuestionsListLayout>
        <div className={styles.questionsContainer}>
          <AdminQuestions />
        </div>
      </QuestionsListLayout>
    </Layout>
  );
};

AdminPage.getInitialProps = (ctx: GetInitialPropsContext) => {
  const state = ctx.store.getState();
  if (!getLoggedInUser(state)) {
    return redirect('/login', { previousPath: getPreviousPathFromHrefQuery('/admin') }, ctx);
  }
};

export default AdminPage;
