import type { NextComponentType } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import Layout from '../components/layout/Layout';
import QuestionsListLayout from '../components/questions/questionsListLayout/QuestionsListLayout';
import { getLoggedInUser } from '../redux/selectors/selectors';
import { redirect, getPreviousPathFromHrefQuery } from '../utils/redirect';

import styles from './pages.module.scss';

const AdminQuestions = dynamic(() =>
  import(/* webpackChunkName: "AdminQuestions" */ '../components/adminQuestions/AdminQuestions')
);

const AdminPage: NextComponentType = () => {
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

AdminPage.getInitialProps = (ctx) => {
  const state = ctx.store.getState();
  if (!getLoggedInUser(state)) {
    redirect('/login', { previousPath: getPreviousPathFromHrefQuery('/admin') }, ctx);
  }
  return {};
};

export default AdminPage;
