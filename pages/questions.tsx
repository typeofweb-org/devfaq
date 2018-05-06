import * as React from 'react';
import './index.scss';
import Layout from '../components/layout/Layout';
import { AppState } from '../redux/reducers/index';
import QuestionsListView from './questions/questionsListLayout/QuestionsListView';

export default class Index extends React.Component<ReturnType<typeof mapStateToProps>> {
  render() {
    return (
      <Layout title="Pytania">
        <QuestionsListView />
      </Layout>
    );
  }
}

const mapStateToProps = (state: AppState) => {
  return {
    foo: state.foo,
  };
};
