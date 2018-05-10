import { createSelector } from 'reselect';
import { AppState } from '../reducers';
import env from '../../utils/env';
import { Question } from '../reducers/questions';
import { TechnologyKey } from '../../constants/technology-icon-items';

const questionsSelector = (state: AppState) => state.questions;
const selectedQuestionsSelector = (state: AppState) => state.selectedQuestions;

export const isDownloadEnabledSelector = createSelector(
  questionsSelector,
  (questions) => questions && questions.length > 0
);

export const areAnyQuestionSelected = createSelector(
  selectedQuestionsSelector,
  (selectedQuestions) => selectedQuestions.length > 0
);

export const getDownloadUrlSelector = createSelector(
  selectedQuestionsSelector,
  (selectedIds) => `${env.API_URL}/pdf-questions?question=${selectedIds.join(',')}`
);

type SelectedQuestionsByTechnology = { [key in TechnologyKey]: Question[] };

export const getSelectedQuestionsByCategory = createSelector(
  selectedQuestionsSelector,
  (selectedQuestions): SelectedQuestionsByTechnology => {
    return selectedQuestions.reduce<SelectedQuestionsByTechnology>(
      (acc, selectedQuestion) => {
        acc[selectedQuestion.category].push(selectedQuestion);
        return acc;
      },
      {
        html: [],
        css: [],
        js: [],
        angular: [],
        react: [],
        git: [],
        other: [],
      }
    );
  }
);
