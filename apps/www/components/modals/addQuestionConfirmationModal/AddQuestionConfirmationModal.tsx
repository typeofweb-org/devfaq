import classNames from 'classnames';
import React, { memo, useCallback, forwardRef } from 'react';

import { useDidMount } from '../../../utils/hooks';
import { BaseModal, CommonModalProps } from '../baseModal/BaseModal';

import styles from './addQuestionConfirmationModal.module.scss';

const reportEvent = (action: string) => globalReportEvent(action, 'Przesłane nowe pytanie warstwa');

export const AddQuestionConfirmationModal = memo(
  forwardRef<HTMLDivElement, CommonModalProps>(({ onClose }, ref) => {
    useDidMount(() => {
      reportEvent('Wyświetlenie');
    });

    const handleClose: CommonModalProps['onClose'] = useCallback(
      (arg) => {
        if (arg.reason === 'ok') {
          reportEvent('OK');
        } else {
          reportEvent('Zamknij');
        }

        onClose(arg);
      },
      [onClose]
    );

    const close: React.MouseEventHandler<HTMLButtonElement> = useCallback(
      (e) => {
        handleClose({ event: e, reason: 'ok' });
      },
      [handleClose]
    );

    const renderContent = useCallback(() => {
      return (
        <div className={styles.addQuestionConfirmationModal}>
          <p id="add-question-confirmation-modal-description">
            Jeszcze momencik… a Twoje pytanie pojawi się na liście dostępnych pytań. Najpierw musimy
            rzucić na nie okiem i zatwierdzić.
            <br /> W międzyczasie zajrzyj na bloga ❤️
          </p>
          <div className={styles.logos}>
            <a
              href="https://typeofweb.com/"
              target="_blank"
              rel="noopener noreferrer"
              title="Type of Web"
              onClick={() => reportEvent('Type of Web - klik')}
            >
              <img src="/images/typeofweb-logo.svg" alt="Type of Web" />
            </a>
          </div>
          <button
            className={classNames('round-button', styles.roundButton, 'alternative-button')}
            onClick={close}
            data-cy="close-add-question-form"
          >
            OK!
          </button>
        </div>
      );
    }, [close]);

    return (
      <BaseModal
        ref={ref}
        type="confirmation"
        className={styles.addQuestionConfirmationModal}
        closable={true}
        renderContent={renderContent}
        onClose={handleClose}
        aria-describedby="add-question-confirmation-modal-description"
      />
    );
  })
);
