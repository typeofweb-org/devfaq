import { createSelector } from 'reselect';
import { AppState } from '../reducers';
import env from '../../utils/env';
import { Question } from '../reducers/questions';
import { TechnologyKey } from '../../constants/technology-icon-items';

// const questionsSelector = (state: AppState) => state.questions;
const selectedQuestionsSelector = (state: AppState) => state.selectedQuestions;
const routeDetailsSelector = (state: AppState) => state.routeDetails;

export const getTechnology = createSelector(
  routeDetailsSelector,
  ({ current }) => current.query && (current.query.technology as TechnologyKey)
);

export const getAreAnyQuestionSelected = createSelector(
  selectedQuestionsSelector,
  selectedQuestions => selectedQuestions.length > 0
);

export const getSelectedQuestionsIds = createSelector(selectedQuestionsSelector, questions =>
  questions.map(q => q.id)
);

export const getDownloadUrl = createSelector(
  getSelectedQuestionsIds,
  selectedIds => `${env.API_URL}/pdf-questions?question=${selectedIds.join(',')}`
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

export const getSelectedQuestionsWithCategories = createSelector(
  getSelectedQuestionsByCategory,
  selectedQuestionsByCategory => {
    return Object.entries(selectedQuestionsByCategory).filter(
      ([_, questions]) => questions.length > 0
    ) as Array<[TechnologyKey, Question[]]>;
  }
);
