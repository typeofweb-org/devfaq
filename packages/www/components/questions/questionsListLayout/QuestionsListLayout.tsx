import React from 'react';

import { Container } from '../../container/Container';

import styles from './questionsListLayout.module.scss';

const QuestionsListLayout: React.SFC = ({ children }) => (
  <div className={styles.appMainContainer}>
    <Container as="main">{children}</Container>
  </div>
);

export default QuestionsListLayout;
