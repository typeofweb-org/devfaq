import { Actions, ActionTypes } from '../actions';
import { Question } from './questions';
import { CommonModalProps } from '../../components/modals/baseModal/BaseModal';

type ModalState<T = any> = {
  open: boolean;
  data?: T;
  onClose?: CommonModalProps['onClose'];
};

const initialUiState = {
  isSidebarOpen: false,
  addQuestionModal: { open: false } as ModalState<Question>,
  isAddQuestionConfirmationModalOpen: false,
};

export const ui = (ui = initialUiState, action: Actions): typeof initialUiState => {
  switch (action.type) {
    case ActionTypes.UI_OPEN_ADD_QUESTION_MODAL:
      return { ...ui, addQuestionModal: { open: true } };
    case ActionTypes.UI_CLOSE_ADD_QUESTION_MODAL:
      return { ...ui, addQuestionModal: { open: false } };
    case ActionTypes.UI_OPEN_EDIT_QUESTION_MODAL:
      return {
        ...ui,
        addQuestionModal: {
          open: true,
          data: action.payload.question,
          onClose: action.payload.onClose,
        },
      };
    case ActionTypes.UI_CLOSE_EDIT_QUESTION_MODAL:
      return {
        ...ui,
        addQuestionModal: { open: false, data: undefined, onClose: undefined },
      };
    case ActionTypes.UI_OPEN_ADD_QUESTION_CONFIRMATION_MODAL:
      return { ...ui, isAddQuestionConfirmationModalOpen: true };
    case ActionTypes.UI_CLOSE_ADD_QUESTION_CONFIRMATION_MODAL:
      return { ...ui, isAddQuestionConfirmationModalOpen: false };
    case ActionTypes.UI_OPEN_SIDEBAR:
      return { ...ui, isSidebarOpen: true };
    case ActionTypes.UI_CLOSE_SIDEBAR:
      return { ...ui, isSidebarOpen: false };
    default:
      return ui;
  }
};
