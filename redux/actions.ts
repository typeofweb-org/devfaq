import { ActionsUnion, createAction } from './types';
import { LevelKey } from '../constants/level';
import { Question } from './reducers/questions';

export const enum ActionTypes {
  UI_OPEN_SIDEBAR = 'UI_OPEN_SIDEBAR',
  UI_CLOSE_SIDEBAR = 'UI_CLOSE_SIDEBAR',
  UI_OPEN_ADD_QUESTION_MODAL = 'UI_OPEN_ADD_QUESTION_MODAL',
  UI_CLOSE_ADD_QUESTION_MODAL = 'UI_CLOSE_ADD_QUESTION_MODAL',
  SELECT_LEVEL = 'SELECT_LEVEL',
  DESELECT_LEVEL = 'DESELECT_LEVEL',
  SELECT_QUESTION = 'SELECT_QUESTION',
  DESELECT_QUESTION = 'DESELECT_QUESTION',
}

export const ActionCreators = {
  uiOpenSidebar: () => createAction(ActionTypes.UI_OPEN_SIDEBAR),
  uiCloseSidebar: () => createAction(ActionTypes.UI_CLOSE_SIDEBAR),
  uiOpenAddQuestionModal: () => createAction(ActionTypes.UI_OPEN_ADD_QUESTION_MODAL),
  uiCloseAddQuestionModal: () => createAction(ActionTypes.UI_CLOSE_ADD_QUESTION_MODAL),
  selectLevel: (level: LevelKey) => createAction(ActionTypes.SELECT_LEVEL, level),
  deselectLevel: (level: LevelKey) => createAction(ActionTypes.DESELECT_LEVEL, level),
  selectQuestion: (q: Question) => createAction(ActionTypes.SELECT_QUESTION, q),
  deselectQuestion: (q: Question) => createAction(ActionTypes.DESELECT_QUESTION, q),
};

export type Actions = ActionsUnion<typeof ActionCreators>;
