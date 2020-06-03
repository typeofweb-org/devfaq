import React from 'react';

import styles from './questionsListLayout.module.scss';

const QuestionsListLayout: React.SFC = ({ children }) => (
  <div className={styles.appMainContainer}>
    <main className="container">{children}</main>
  </div>
);

export default QuestionsListLayout;
