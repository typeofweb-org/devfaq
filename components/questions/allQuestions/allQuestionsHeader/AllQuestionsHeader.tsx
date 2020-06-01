import React from 'react';
import { polishPlurals } from 'polish-plurals';
import headerStyles from './allQuestionsHeader.module.scss';
import styles from '../allQuestions.module.scss';

const getQuestionsLabel = polishPlurals.bind(null, 'pytanie', 'pytania', 'pytań');

export const AllQuestionsHeader: React.SFC<{
  category: string;
  questionsLength: number | undefined;
  sortBy: string;
  onSortByChange: React.ChangeEventHandler<HTMLSelectElement>;
}> = ({ category, questionsLength, onSortByChange, sortBy }) => {
  return (
    <header className={headerStyles.appQuestionsHeader}>
      <output className={styles.appQuestionsCategoryCount}>
        <strong>{category}:</strong> {questionsLength} {getQuestionsLabel(questionsLength || 0)}
      </output>
      <label className={styles.appQuestionsSortingContainer}>
        <span className={styles.appQuestionsSortingLabel}>Sortuj według:</span>
        <select
          onChange={onSortByChange}
          value={sortBy}
          className={styles.appQuestionsSortingSelect}
        >
          <option value="acceptedAt*desc">od najnowszych</option>
          <option value="acceptedAt*asc">od najstarszych</option>
          <option value="level*asc">od najprostszych</option>
          <option value="level*desc">od najtrudniejszych</option>
          <option value="votesCount*asc">od najmniej popularnych</option>
          <option value="votesCount*desc">od najpopularniejszych</option>
        </select>
      </label>
    </header>
  );
};
