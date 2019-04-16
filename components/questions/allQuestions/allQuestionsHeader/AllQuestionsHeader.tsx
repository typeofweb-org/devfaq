import * as React from 'react';
import { polishPlurals } from 'polish-plurals';
import './allQuestionsHeader.scss';

const getQuestionsLabel = polishPlurals.bind(null, 'pytanie', 'pytania', 'pytań');

export const AllQuestionsHeader: React.SFC<{
  category: string;
  questionsLength: number | undefined;
  sortBy: string;
  onSortByChange: React.ChangeEventHandler<HTMLSelectElement>;
}> = ({ category, questionsLength, onSortByChange, sortBy }) => {
  const hasQuestions = Boolean(questionsLength);
  return (
    <header className="app-questions--header">
      <output className="app-questions--category-count">
        <strong>{category}:</strong> {questionsLength} {getQuestionsLabel(questionsLength || 0)}
      </output>
      {hasQuestions && (
        <label className="app-questions--sorting-container">
          <span className="app-questions--sorting-label">Sortuj według:</span>
          <select
            onChange={onSortByChange}
            value={sortBy}
            className="app-questions--sorting-select"
          >
            <option value="acceptedAt*desc">od najnowszych</option>
            <option value="acceptedAt*asc">od najstarszych</option>
            <option value="level*asc">od najprostszych</option>
            <option value="level*desc">od najtrudniejszych</option>
          </select>
        </label>
      )}
    </header>
  );
};
