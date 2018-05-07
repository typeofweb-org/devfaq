import { createSelector } from 'reselect';
import { AppState } from '../reducers';
import env from '../../utils/env';

const questionsSelector = (state: AppState) => state.questions;
const selectedQuestionsSelector = (state: AppState) => state.selectedQuestions;

export const isDownloadEnabledSelector = createSelector(
  questionsSelector,
  (questions) => questions && questions.length > 0
);

export const getSelectedIdsSelector = createSelector(
  selectedQuestionsSelector,
  (selectedQuestions) =>
    (Object.keys(selectedQuestions) as (keyof typeof selectedQuestions)[])
      .map((category) => selectedQuestions[category])
      .reduce((acc, next) => acc.concat(next), [])
      .map(({ id }) => id)
);

export const areAnyQuestionSelected = createSelector(
  selectedQuestionsSelector,
  (selectedQuestions) => Object.values(selectedQuestions).some((questions) => questions.length > 0)
);

export const getDownloadUrlSelector = createSelector(
  getSelectedIdsSelector,
  (selectedIds) => `${env.API_URL}/pdf-questions?question=${selectedIds.join(',')}`
);
