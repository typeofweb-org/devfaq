import './allQuestionsFooter.scss';

export const AllQuestionsFooter: React.SFC<{
  onAddNewClick: React.MouseEventHandler<HTMLButtonElement>;
}> = ({ onAddNewClick }) => (
  <footer className="app-questions--footer">
    <p>
      <strong>Czegoś brakuje?</strong> Możesz dodać własne pytania!
    </p>
    <button onClick={onAddNewClick} className="round-button branding-button">
      Dodaj nowe pytanie
    </button>
  </footer>
);
