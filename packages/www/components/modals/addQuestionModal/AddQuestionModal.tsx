import { isEqual } from 'lodash';
import React, { memo, useState, useEffect, useCallback, forwardRef } from 'react';
import { useDispatch } from 'react-redux';

import type { LevelKey } from '../../../constants/level';
import type { TechnologyKey } from '../../../constants/technology-icon-items';
import { ActionCreators } from '../../../redux/actions';
import { Question } from '../../../redux/reducers/questions';
import { Api } from '../../../services/Api';
import { useDidMount, useRenderProp } from '../../../utils/hooks';
import { BaseModal, CommonModalProps } from '../baseModal/BaseModal';

import { AddQuestionModalContent } from './AddQuestionModalContent';
import { AddQuestionModalFooter } from './AddQuestionModalFooter';
import styles from './addQuestionModal.module.scss';

const reportEvent = (action: string) => globalReportEvent(action, 'Nowe pytanie warstwa');

interface AddQuestionModalOwnProps {
  originalQuestion?: Question;
}

type AddQuestionModalProps = AddQuestionModalOwnProps & CommonModalProps;

export const AddQuestionModal = memo(
  forwardRef<HTMLDivElement, AddQuestionModalProps>(({ onClose, originalQuestion }, ref) => {
    const [editedQuestion, setEditedQuestion] = useState<Question>();
    const [questionText, setQuestionText] = useState('');
    const [level, setLevel] = useState<LevelKey>();
    const [technology, setTechnology] = useState<TechnologyKey>();
    const [isLoading, setIsLoading] = useState(false);
    const [valid, setValid] = useState(false);

    const dispatch = useDispatch();

    const isValid = useCallback(() => Boolean(level && technology && questionText.trim()), [
      level,
      questionText,
      technology,
    ]);

    const handleClose: CommonModalProps['onClose'] = useCallback(
      (args) => {
        if (args.reason === 'cancel') {
          reportEvent('Anuluj');
        } else if (args.reason === 'submit') {
          reportEvent('Dodaj pytanie');
        } else {
          reportEvent('Zamknij');
        }
        return onClose(args);
      },
      [onClose]
    );

    const onCancelClick: React.MouseEventHandler<HTMLButtonElement> = useCallback(
      (e) => {
        handleClose({ reason: 'cancel', event: e });
      },
      [handleClose]
    );

    const handleChangeTechnology: React.ChangeEventHandler<HTMLSelectElement> = useCallback((e) => {
      const value = e.currentTarget.value as TechnologyKey;
      setTechnology(value);
    }, []);

    const handleChangeLevel: React.ChangeEventHandler<HTMLSelectElement> = useCallback((e) => {
      const value = e.currentTarget.value as LevelKey;
      setLevel(value);
    }, []);

    const handleChangeQuestionText = useCallback((text: string) => {
      setQuestionText(text);
    }, []);

    const handleSubmit: React.MouseEventHandler<HTMLButtonElement> = useCallback(() => {
      if (!isValid()) {
        return;
      }

      setIsLoading(true);

      // remove `| undefined` because `isValid()` determines we're good to go
      const body = {
        question: questionText!,
        level: level!,
        category: technology!,
      };

      if (originalQuestion) {
        return Api.updateQuestion(originalQuestion.id, {
          ...body,
          status: 'accepted',
        })
          .then(() => {
            onClose({ reason: 'submit' });
          })
          .finally(() => setIsLoading(false));
      } else {
        return Api.createQuestion(body)
          .then(() => {
            onClose({ reason: 'submit' });
            dispatch(ActionCreators.uiOpenAddQuestionConfirmationModal());
          })
          .finally(() => setIsLoading(false));
      }
    }, [dispatch, isValid, level, onClose, originalQuestion, questionText, technology]);

    const validate = useCallback(() => {
      setValid(isValid());
    }, [isValid]);

    const renderContent = useRenderProp(AddQuestionModalContent, {
      handleChangeLevel,
      handleChangeQuestionText,
      handleChangeTechnology,
      level,
      originalQuestion,
      questionText,
      technology,
    });

    const renderFooter = useRenderProp(AddQuestionModalFooter, {
      handleSubmit,
      isLoading,
      onCancelClick,
      valid,
    });

    useEffect(() => {
      validate();
    });

    useDidMount(() => {
      reportEvent('Wyświetlenie');
      setValid(isValid());
    });

    useEffect(() => {
      if (!originalQuestion || isEqual(originalQuestion, editedQuestion)) {
        return;
      }
      setEditedQuestion(originalQuestion);
      setLevel(originalQuestion._levelId);
      setTechnology(originalQuestion._categoryId);
      setQuestionText(originalQuestion.question);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [originalQuestion]);

    return (
      <BaseModal
        ref={ref}
        type="add"
        className={styles.addQuestionModal}
        closable={true}
        renderContent={renderContent}
        renderFooter={renderFooter}
        onClose={handleClose}
        aria-labelledby="addQuestionModalTitle"
      />
    );
  })
);
