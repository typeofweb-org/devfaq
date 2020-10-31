import React, { memo, useCallback, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';

import { useUIContext } from '../../../contexts/UIContextProvider';
import { AddQuestionConfirmationModal } from '../addQuestionConfirmationModal/AddQuestionConfirmationModal';
import { AddQuestionModal } from '../addQuestionModal/AddQuestionModal';
import { CommonModalProps } from '../baseModal/BaseModal';
import styles from '../baseModal/baseModal.module.scss';

const timeout = 200;

export const AppModals = memo(() => {
  const addQuestionModalRef = useRef<HTMLDivElement>(null);
  const addQuestionConfirmationModalRef = useRef<HTMLDivElement>(null);

  const {
    addQuestionModalState,
    closeAddQuestionModal,
    isAddQuestionConfirmationModalOpen,
    closeEditQuestionModal,
    closeAddQuestionConfirmationModal,
  } = useUIContext();

  const closeQuestionModal: CommonModalProps['onClose'] = useCallback(
    (args) => {
      if (addQuestionModalState.onClose) {
        addQuestionModalState.onClose(args);
      }
      if (addQuestionModalState.data) {
        closeEditQuestionModal();
      } else {
        closeAddQuestionModal();
      }
    },
    [addQuestionModalState, closeAddQuestionModal, closeEditQuestionModal]
  );

  const closeConfirmationModal: CommonModalProps['onClose'] = useCallback(
    (_args) => {
      closeAddQuestionConfirmationModal();
    },
    [closeAddQuestionConfirmationModal]
  );

  return (
    <>
      <CSSTransition
        in={addQuestionModalState.open}
        unmountOnExit={true}
        mountOnEnter={true}
        classNames={{
          enter: styles.fadeEnter,
          enterActive: styles.fadeEnterActive,
          enterDone: styles.fadeEnterDone,
          exit: styles.fadeExit,
          exitActive: styles.fadeExitActive,
        }}
        timeout={timeout}
        nodeRef={addQuestionModalRef}
      >
        <AddQuestionModal
          ref={addQuestionModalRef}
          originalQuestion={addQuestionModalState.data}
          onClose={closeQuestionModal}
        />
      </CSSTransition>

      <CSSTransition
        in={isAddQuestionConfirmationModalOpen}
        unmountOnExit={true}
        mountOnEnter={true}
        nodeRef={addQuestionConfirmationModalRef}
        classNames={{
          enter: styles.fadeEnter,
          enterActive: styles.fadeEnterActive,
          enterDone: styles.fadeEnterDone,
          exit: styles.fadeExit,
          exitActive: styles.fadeExitActive,
        }}
        timeout={timeout}
      >
        <AddQuestionConfirmationModal
          ref={addQuestionConfirmationModalRef}
          onClose={closeConfirmationModal}
        />
      </CSSTransition>
    </>
  );
});
