import React from 'react';
import classNames from 'classnames';
import styles from './baseModal.module.scss';

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

class FixBodyService {
  private windowOffsetY = 0;
  // @ts-ignore
  private scrollbarWidth = 0;

  constructor() {
    if (typeof window === 'undefined') {
      return;
    }

    this.scrollbarWidth = this.getScrollbarWidth();
  }

  fixBody() {
    if (typeof window === 'undefined') {
      return;
    }

    this.windowOffsetY = window.pageYOffset;
    document.body.classList.add('not-scrollable');
    document.body.style.top = `-${this.windowOffsetY}px`;
    document.body.style.paddingRight = `${this.scrollbarWidth}px`;
    // tslint:disable-next-line:no-magic-numbers
    document.body.style.marginLeft = `-${this.scrollbarWidth / 2}px`;
  }

  unfixBody() {
    if (typeof window === 'undefined') {
      return;
    }

    document.body.classList.remove('not-scrollable');
    document.body.style.top = '';
    document.body.style.paddingRight = '';
    document.body.style.marginLeft = '';
    requestAnimationFrame(() => window.scrollTo(0, this.windowOffsetY));
  }

  private getScrollbarWidth() {
    const outer = document.createElement('div');
    outer.style.visibility = 'hidden';
    outer.style.width = '100px';
    outer.style.msOverflowStyle = 'scrollbar'; // needed for WinJS apps

    document.body.appendChild(outer);

    const widthNoScroll = outer.offsetWidth;
    // force scrollbars
    outer.style.overflow = 'scroll';

    // add innerdiv
    const inner = document.createElement('div');
    inner.style.width = '100%';
    outer.appendChild(inner);

    const widthWithScroll = inner.offsetWidth;

    // remove divs
    outer.parentNode!.removeChild(outer);

    return widthNoScroll - widthWithScroll;
  }
}

// tslint:disable-next-line:max-classes-per-file
export default class BaseModal extends React.Component<BaseModalOwnProps> {
  static defaultProps: Partial<BaseModalOwnProps> = {
    closable: false,
    type: undefined,
    renderContent: () => null,
    renderFooter: () => null,
  };

  contentRef = React.createRef<HTMLDivElement>();
  fixBodyService = new FixBodyService();
  lastFocusedElement: Element | null = null;

  componentDidMount() {
    this.fixBodyService.fixBody();
    this.lastFocusedElement = document.activeElement;

    const firstFocusable =
      this.contentRef.current && this.findFirstFocusableChild(this.contentRef.current);
    if (this.elementIsFocusable(firstFocusable)) {
      firstFocusable.focus();
    }
  }

  componentWillUnmount() {
    this.fixBodyService.unfixBody();
    if (this.elementIsFocusable(this.lastFocusedElement)) {
      this.lastFocusedElement.focus();
    }
  }

  render() {
    const { closable, type, renderContent, renderFooter } = this.props;
    return (
      <div
        className={classNames(styles.appModalContainer, this.props.className)}
        role="dialog"
        tabIndex={0}
        aria-modal={true}
        aria-labelledby={this.props['aria-labelledby']}
        aria-describedby={this.props['aria-describedby']}
      >
        <div className={styles.appModal}>
          {closable && (
            <header className={styles.appModalHeader}>
              <button className={styles.appModalClose} title="Zamknij" onClick={this.close}>
                &times;
              </button>
            </header>
          )}
          <div className={styles.appModalContent} ref={this.contentRef}>
            <div className={styles.appModalBody}>
              <div className={classNames(styles.actionIcon, 'action-icon_' + type || '')} />
              {renderContent!()}
            </div>
            <footer className={styles.appModalFooter}>{renderFooter!()}</footer>
          </div>
        </div>
      </div>
    );
  }

  close: React.MouseEventHandler<HTMLButtonElement> = e => {
    this.props.onClose({ event: e });
  };

  private findFirstFocusableChild(el: HTMLElement) {
    return el.querySelector('input, select, textarea, button, [tabindex]');
  }

  private elementIsFocusable(el: Node | null): el is HTMLElement {
    return el ? 'focus' in el : false;
  }
}
