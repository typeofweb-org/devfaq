import classNames from 'classnames';
import React, { memo, useRef, useEffect, useCallback, forwardRef } from 'react';

import styles from './baseModal.module.scss';
import { FixBodyService } from './fixBodyService';

export type ModalType = 'warning' | 'confirmation' | 'thumbs-up' | 'add';

export interface CommonModalProps {
  onClose(arg: { reason?: string; event?: React.SyntheticEvent<HTMLElement> }): any;
}

type BaseModalOwnProps = CommonModalProps & {
  closable?: boolean;
  type?: ModalType;
  className: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  renderContent?(): React.ReactNode;
  renderFooter?(): React.ReactNode;
};

const fixBodyService = new FixBodyService();

const findFirstFocusableChild = (el: HTMLElement) => {
  return el.querySelector('input, select, textarea, button, [tabindex]');
};

const elementIsFocusable = (el: Node | null): el is HTMLElement => {
  return el ? 'focus' in el : false;
};

export const BaseModal = memo(
  forwardRef<HTMLDivElement, BaseModalOwnProps>(
    (
      {
        closable = false,
        type = undefined,
        renderContent = () => null,
        renderFooter = () => null,
        onClose,
        className,
        'aria-labelledby': ariaLabelledby,
        'aria-describedby': ariaLescribedby,
      },
      ref
    ) => {
      const contentRef = useRef<HTMLDivElement | null>(null);
      const previousFocusedElement = useRef<Element | null>(null);

      const close: React.MouseEventHandler<HTMLButtonElement> = useCallback(
        (e) => onClose({ event: e }),
        [onClose]
      );

      useEffect(() => {
        fixBodyService.fixBody();
        previousFocusedElement.current = document.activeElement;

        const firstFocusable = contentRef.current && findFirstFocusableChild(contentRef.current);
        if (elementIsFocusable(firstFocusable)) {
          firstFocusable.focus();
        }

        return () => {
          fixBodyService.unfixBody();
          if (elementIsFocusable(previousFocusedElement.current)) {
            previousFocusedElement.current.focus();
          }
        };
      }, []);

      return (
        <div
          ref={ref}
          className={classNames('app-modal-container', styles.appModalContainer, className)}
          role="dialog"
          tabIndex={0}
          aria-modal={true}
          aria-labelledby={ariaLabelledby}
          aria-describedby={ariaLescribedby}
        >
          <div className={classNames('app-modal', styles.appModal)}>
            {closable && (
              <header className={styles.appModalHeader}>
                <button className={styles.appModalClose} title="Zamknij" onClick={close}>
                  &times;
                </button>
              </header>
            )}
            <div className={styles.appModalContent} ref={contentRef}>
              <div className={styles.appModalBody}>
                <div className={classNames(styles.actionIcon, 'action-icon_' + type || '')} />
                {renderContent()}
              </div>
              <footer className={styles.appModalFooter}>{renderFooter()}</footer>
            </div>
          </div>
        </div>
      );
    }
  )
);
