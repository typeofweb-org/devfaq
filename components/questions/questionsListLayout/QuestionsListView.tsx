import './questionsListView.scss';
import MobileActionButtons from '../mobileActionButtons/MobileActionButtons';

const QuestionsListView = () => (
  <div className="app-main-container">
    <main className="container app-main">
      <MobileActionButtons justDownload={false} />
    </main>
  </div>
);

export default QuestionsListView;
