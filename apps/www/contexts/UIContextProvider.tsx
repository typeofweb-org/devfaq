import React, { Dispatch, SetStateAction, useCallback, useContext, useState } from 'react';

import { CommonModalProps } from '../components/modals/baseModal/BaseModal';
import { Question } from '../redux/reducers/questions';

type ModalState<T = any> = {
  open: boolean;
  data?: T;
  onClose?: CommonModalProps['onClose'];
};

type UiContextType = {
  isSidebarOpen: boolean;
  setIsSidebarOpen: Dispatch<SetStateAction<boolean>>;
  addQuestionModalState: ModalState<Question>;
  openAddQuestionModal: () => void;
  closeAddQuestionModal: () => void;
  openEditQuestionModal: (question: Question, onClose?: CommonModalProps['onClose']) => void;
  closeEditQuestionModal: () => void;
  isAddQuestionConfirmationModalOpen: boolean;
  setIsAddQuestionConfirmationModalOpen: Dispatch<SetStateAction<boolean>>;
};

const UIContext = React.createContext<undefined | UiContextType>(undefined);

const UIContextProvider: React.FC = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [addQuestionModalState, setAddQuestionModalState] = useState<ModalState<Question>>({
    open: false,
  });
  const [isAddQuestionConfirmationModalOpen, setIsAddQuestionConfirmationModalOpen] = useState(
    false
  );

  const openAddQuestionModal = useCallback(() => {
    setAddQuestionModalState({ open: true });
  }, []);

  const closeAddQuestionModal = useCallback(() => {
    setAddQuestionModalState({ open: false });
  }, []);

  const openEditQuestionModal = useCallback(
    (question: Question, onClose?: CommonModalProps['onClose']) => {
      setAddQuestionModalState({ open: true, data: question, onClose });
    },
    []
  );

  const closeEditQuestionModal = useCallback(() => {
    setAddQuestionModalState({ open: false, data: undefined, onClose: undefined });
  }, []);

  return (
    <UIContext.Provider
      value={{
        isSidebarOpen,
        setIsSidebarOpen,
        addQuestionModalState,
        openAddQuestionModal,
        closeAddQuestionModal,
        openEditQuestionModal,
        closeEditQuestionModal,
        isAddQuestionConfirmationModalOpen,
        setIsAddQuestionConfirmationModalOpen,
      }}
    >
      {children}
    </UIContext.Provider>
  );
};

export const useUIContext = () => {
  const ctx = useContext(UIContext);
  if (ctx === undefined) {
    throw new Error('useUIContext must be used within a UIContextProvider');
  }
  return ctx;
};

export default UIContextProvider;
