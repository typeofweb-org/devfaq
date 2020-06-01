import { Question } from '../../redux/reducers/questions';

export const isQuestionSelected = (
  selectedQuestionIds: number[],
  questionId: Question['id']
): boolean => {
  return selectedQuestionIds.includes(questionId);
};
