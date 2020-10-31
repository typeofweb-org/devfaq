import React, { useCallback, useContext, useMemo, useState } from 'react';

import { CommonModalProps } from '../components/modals/baseModal/BaseModal';
import { Question } from '../redux/reducers/questions';

type ModalState<T = any> = {
  open: boolean;
  data?: T;
  onClose?: CommonModalProps['onClose'];
};

type UiContextType = {
  isSidebarOpen: boolean;
  openSideBar: () => void;
  closeSidebar: () => void;
  addQuestionModalState: ModalState<Question>;
  openAddQuestionModal: () => void;
  closeAddQuestionModal: () => void;
  openEditQuestionModal: (question: Question, onClose?: CommonModalProps['onClose']) => void;
  closeEditQuestionModal: () => void;
  isAddQuestionConfirmationModalOpen: boolean;
  openAddQuestionConfirmationModal: () => void;
  closeAddQuestionConfirmationModal: () => void;
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

  const openSideBar = useCallback(() => {
    setIsSidebarOpen(true);
  }, []);

  const closeSidebar = useCallback(() => {
    setIsSidebarOpen(false);
  }, []);

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

  const openAddQuestionConfirmationModal = useCallback(() => {
    setIsAddQuestionConfirmationModalOpen(true);
  }, []);

  const closeAddQuestionConfirmationModal = useCallback(() => {
    setIsAddQuestionConfirmationModalOpen(false);
  }, []);

  const memoizedValue = useMemo(
    () => ({
      isSidebarOpen,
      openSideBar,
      closeSidebar,
      addQuestionModalState,
      openAddQuestionModal,
      closeAddQuestionModal,
      openEditQuestionModal,
      closeEditQuestionModal,
      isAddQuestionConfirmationModalOpen,
      openAddQuestionConfirmationModal,
      closeAddQuestionConfirmationModal,
    }),
    [
      isSidebarOpen,
      openSideBar,
      closeSidebar,
      addQuestionModalState,
      openAddQuestionModal,
      closeAddQuestionModal,
      openEditQuestionModal,
      closeEditQuestionModal,
      isAddQuestionConfirmationModalOpen,
      openAddQuestionConfirmationModal,
      closeAddQuestionConfirmationModal,
    ]
  );

  return <UIContext.Provider value={memoizedValue}>{children}</UIContext.Provider>;
};

export const useUIContext = () => {
  const ctx = useContext(UIContext);
  if (!ctx) {
    throw new Error('useUIContext must be used within a UIContextProvider');
  }
  return ctx;
};

export default UIContextProvider;
