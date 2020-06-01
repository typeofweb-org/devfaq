import React from 'react';
import { redirect, getPreviousPathFromHrefQuery } from '../utils/redirect';
import Layout from '../components/layout/Layout';
import QuestionsListLayout from '../components/questions/questionsListLayout/QuestionsListLayout';
import dynamic from 'next/dynamic';
import { getLoggedInUser } from '../redux/selectors/selectors';
import { NextPageContext } from 'next';
import styles from './pages.module.scss';

const AdminQuestions = dynamic(() => import('../components/adminQuestions/AdminQuestions'));

export default class AdminPage extends React.Component {
  static async getInitialProps(ctx: NextPageContext) {
    const state = ctx.store.getState();
    if (!getLoggedInUser(state)) {
      return redirect('/login', { previousPath: getPreviousPathFromHrefQuery('/admin') }, ctx);
    }
  }

  render() {
    return (
      <Layout title="Admin">
        <QuestionsListLayout>
          <div className={styles.questionsContainer}>
            <AdminQuestions />
          </div>
        </QuestionsListLayout>
      </Layout>
    );
  }
}
