import ActiveLink from '../../activeLink/ActiveLink';
import './noQuestionsSelectedInfo.scss';

const NoQuestionsSelectedInfo = () => {
  return (
    <div className="selected-questions--empty container">
      <p>Najpierw zaznacz jakieś pytania, a następnie wróć tutaj aby zobaczyć podgląd!</p>
      <ActiveLink route="/questions">
        <a
          className="round-button alternative-button"
          onClick={() => globalReportEvent('Zaznacz pytania', 'Wybrane pytania')}
        >
          Zaznacz pytania
        </a>
      </ActiveLink>
    </div>
  );
};

export default NoQuestionsSelectedInfo;
