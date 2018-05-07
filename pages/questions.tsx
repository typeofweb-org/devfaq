import * as React from 'react';
import './index.scss';
import Layout from '../components/layout/Layout';
import QuestionsListView from '../components/questions/questionsListLayout/QuestionsListView';

export default class Index extends React.Component {
  render() {
    return (
      <Layout title="Pytania">
        <QuestionsListView />
      </Layout>
    );
  }
}
