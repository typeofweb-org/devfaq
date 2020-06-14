import React from 'react';

import { ActiveLink } from '../../activeLink/ActiveLink';
import { Container } from '../../container/Container';

import styles from './noQuestionsSelectedInfo.module.scss';

const NoQuestionsSelectedInfo = () => {
  return (
    <Container className={styles.selectedQuestionsEmpty}>
      <p>Najpierw zaznacz jakieś pytania, a następnie wróć tutaj aby zobaczyć podgląd!</p>
      <ActiveLink href="/questions" activeClassName="">
        <a
          className="round-button alternative-button"
          onClick={() => globalReportEvent('Zaznacz pytania', 'Wybrane pytania')}
        >
          Zaznacz pytania
        </a>
      </ActiveLink>
    </Container>
  );
};

export default NoQuestionsSelectedInfo;
