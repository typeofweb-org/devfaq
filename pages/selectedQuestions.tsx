import * as React from 'react';
import QuestionsListLayout from '../components/questions/questionsListLayout/QuestionsListLayout';
import Layout from '../components/layout/Layout';
import './index.scss';
import MobileActionButtons from '../components/questions/mobileActionButtons/MobileActionButtons';
import AllQuestions from '../components/questions/allQuestions/AllQuestions';

export default class SelectedQuestionsPage extends React.Component {
  render() {
    return (
      <Layout title="Wybrane pytania">
        <MobileActionButtons justDownload={true} />
        <QuestionsListLayout>
          <AllQuestions />
        </QuestionsListLayout>
      </Layout>
    );
  }
}
