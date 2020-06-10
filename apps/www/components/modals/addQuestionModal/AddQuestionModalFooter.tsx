import classNames from 'classnames';
import React, { memo } from 'react';

import { Question } from '../../../redux/reducers/questions';

import styles from './addQuestionModal.module.scss';

type AddQuestionModalFooterProps = {
  isLoading: boolean;
  valid: boolean;
  originalQuestion?: Question;
  handleSubmit: React.MouseEventHandler<HTMLButtonElement>;
  onCancelClick: React.MouseEventHandler<HTMLButtonElement>;
};

export const AddQuestionModalFooter = memo<AddQuestionModalFooterProps>(
  ({ isLoading, valid, originalQuestion, handleSubmit, onCancelClick }) => {
    console.log({ valid, isLoading });
    return (
      <div>
        <button
          className={classNames(
            'round-button',
            'branding-button-inverse',
            styles.brandingButtonInverse,
            {
              loading: isLoading,
            }
          )}
          disabled={!valid || isLoading}
          type="button"
          onClick={handleSubmit}
        >
          {originalQuestion ? 'Akceptuj' : 'Dodaj pytanie'}
        </button>
        <button className="round-button branding-button" onClick={onCancelClick}>
          Anuluj
        </button>
      </div>
    );
  }
);
