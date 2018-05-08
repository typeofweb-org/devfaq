import './questionsListView.scss';
import MobileActionButtons from '../mobileActionButtons/MobileActionButtons';
import QuestionsSidebar from '../questionsSidebar/QuestionsSidebar';

const QuestionsListView = () => (
  <div className="app-main-container">
    <main className="container app-main">
      <MobileActionButtons justDownload={false} />
      <QuestionsSidebar />
    </main>
  </div>
);

export default QuestionsListView;
