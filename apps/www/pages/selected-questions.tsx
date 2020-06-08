import type { NextComponentType } from 'next';
import React from 'react';

import Layout from '../components/layout/Layout';
import MobileActionButtons from '../components/questions/mobileActionButtons/MobileActionButtons';
import QuestionsListLayout from '../components/questions/questionsListLayout/QuestionsListLayout';
import SelectedQuestions from '../components/questions/selectedQuestions/SelectedQuestions';

const SelectedQuestionsPage: NextComponentType = () => {
  return (
    <Layout title="Wybrane pytania">
      <QuestionsListLayout>
        <SelectedQuestions />
      </QuestionsListLayout>
      <MobileActionButtons justDownload={true} />
    </Layout>
  );
};
export default SelectedQuestionsPage;
