import * as React from 'react';
import { polishPlurals } from 'polish-plurals';
import './allQuestionsHeader.scss';

const getQuestionsLabel = polishPlurals.bind(null, 'pytanie', 'pytania', 'pytań');

export const AllQuestionsHeader: React.SFC<{ category: string; questionsLength: number }> = ({
  category,
  questionsLength,
}) => (
  <header className="app-questions--header">
    <output className="app-questions--category-count">
      <strong>{category}:</strong> {questionsLength} {getQuestionsLabel(questionsLength)}
    </output>
    <label className="app-questions--sorting-container">
      <span className="app-questions--sorting-label">Sortuj według:</span>
      <select className="app-questions--sorting-select">
        <option>najnowsze</option>
      </select>
    </label>
  </header>
);
