import { Question } from '../../redux/reducers/questions';

export const isQuestionSelected = (selectedQuestionIds: number[], question: Question): boolean => {
  return selectedQuestionIds.includes(question.id);
};
