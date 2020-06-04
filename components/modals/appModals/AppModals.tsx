import React, { useRef, memo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { CSSTransition } from 'react-transition-group';

import { ActionCreators } from '../../../redux/actions';
import { AddQuestionConfirmationModal } from '../addQuestionConfirmationModal/AddQuestionConfirmationModal';
import { AddQuestionModal } from '../addQuestionModal/AddQuestionModal';
import { CommonModalProps } from '../baseModal/BaseModal';
import styles from '../baseModal/baseModal.module.scss';

const timeout = 200;

export const AppModals = memo(() => {
  const addQuestionModalRef = useRef<HTMLDivElement>(null);
  const addQuestionConfirmationModalRef = useRef<HTMLDivElement>(null);

  const dispatch = useDispatch();
  const addQuestionModalState = useSelector((state) => state.ui.addQuestionModal);
  const isAddQuestionConfirmationModalOpen = useSelector(
    (state) => state.ui.isAddQuestionConfirmationModalOpen
  );

  const closeQuestionModal: CommonModalProps['onClose'] = useCallback(
    (args) => {
      if (addQuestionModalState.onClose) {
        addQuestionModalState.onClose(args);
      }
      if (addQuestionModalState.data) {
        dispatch(ActionCreators.uiCloseEditQuestionModal());
      } else {
        dispatch(ActionCreators.uiCloseAddQuestionModal());
      }
    },
    [addQuestionModalState, dispatch]
  );

  const closeConfirmationModal: CommonModalProps['onClose'] = useCallback(
    (_args) => {
      dispatch(ActionCreators.uiCloseAddQuestionConfirmationModal());
    },
    [dispatch]
  );

  return (
    <React.Fragment>
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
    </React.Fragment>
  );
});
