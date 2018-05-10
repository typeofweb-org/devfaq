import './questionsListLayout.scss';

const QuestionsListLayout: React.SFC = ({ children }) => (
  <div className="app-main-container">
    <main className="container app-main">{children}</main>
  </div>
);

export default QuestionsListLayout;
