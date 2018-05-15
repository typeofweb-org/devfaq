import ActiveLink from '../../activeLink/ActiveLink';
import './noQuestionsSelectedInfo.scss';

const reportEvent = (_str: string) => {};

const NoQuestionsSelectedInfo = () => {
  return (
    <div className="selected-questions--empty container">
      <p>Najpierw zaznacz jakieś pytania, a następnie wróć tutaj aby zobaczyć podgląd!</p>
      <ActiveLink route="/questions">
        <a
          className="round-button alternative-button"
          onClick={() => reportEvent('Zaznacz pytania')}
        >
          Zaznacz pytania
        </a>
      </ActiveLink>
    </div>
  );
};

export default NoQuestionsSelectedInfo;
