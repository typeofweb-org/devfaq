import React from 'react';

import styles from './allQuestionsFooter.module.scss';

export const AllQuestionsFooter = React.memo<{
  onAddNewClick: React.MouseEventHandler<HTMLButtonElement>;
}>(({ onAddNewClick }) => (
  <footer className={styles.appQuestionsFooter}>
    <p>
      <strong>Czegoś brakuje?</strong> Możesz dodać własne pytania!
    </p>
    <button onClick={onAddNewClick} className="round-button branding-button">
      Dodaj nowe pytanie
    </button>
  </footer>
));
