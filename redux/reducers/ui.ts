import { Actions, ActionTypes } from '../actions';

const initialUiState = {
  isSidebarOpen: false,
  isAddQuestionModalOpen: false,
};

export const ui = (ui = initialUiState, action: Actions) => {
  switch (action.type) {
    case ActionTypes.UI_OPEN_ADD_QUESTION_MODAL:
      return { ...ui, isAddQuestionModalOpen: true };
    case ActionTypes.UI_CLOSE_ADD_QUESTION_MODAL:
      return { ...ui, isAddQuestionModalOpen: false };
    case ActionTypes.UI_OPEN_SIDEBAR:
      return { ...ui, isSidebarOpen: true };
    case ActionTypes.UI_CLOSE_SIDEBAR:
      return { ...ui, isSidebarOpen: false };
    default:
      return ui;
  }
};
