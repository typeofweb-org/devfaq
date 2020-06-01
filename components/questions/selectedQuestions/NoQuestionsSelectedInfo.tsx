import ActiveLink from '../../activeLink/ActiveLink';
import styles from './noQuestionsSelectedInfo.module.scss';
import classNames from 'classnames';

const NoQuestionsSelectedInfo = () => {
  return (
    <div className={classNames(styles.selectedQuestionsEmpty, 'container')}>
      <p>Najpierw zaznacz jakieś pytania, a następnie wróć tutaj aby zobaczyć podgląd!</p>
      <ActiveLink href="/questions" activeClassName="">
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
