import * as React from 'react';
import './index.scss';
import Layout from '../components/layout/Layout';
import QuestionsListView from '../components/questions/questionsListLayout/QuestionsListView';
import { redirect } from '../utils/redirect';
import { GetInitialPropsContext } from '../utils/types';

export default class Index extends React.Component {
  static async getInitialProps(ctx: GetInitialPropsContext) {
    if (!ctx.query || !ctx.query.technology) {
      return redirect(ctx, '/questions/js');
    }
  }
  render() {
    return (
      <Layout title="Pytania">
        <QuestionsListView />
      </Layout>
    );
  }
}
