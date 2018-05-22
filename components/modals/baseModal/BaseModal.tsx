import * as React from 'react';
import * as classNames from 'classnames';
import './baseModal.scss';

export type ModalType = 'warning' | 'confirmation' | 'thumbs-up' | 'add';

export type CommonModalProps = {
  onClose(arg: { reason?: string; event?: React.SyntheticEvent<HTMLElement> }): any;
};

type BaseModalOwnProps = CommonModalProps & {
  closable?: boolean;
  type?: ModalType;
  renderContent?(): React.ReactNode;
  renderFooter?(): React.ReactNode;
  className: string;
};

class FixBodyService {
  private windowOffsetY = 0;
  //@ts-ignore
  private scrollbarWidth = 0;

  constructor() {
    if (typeof window === 'undefined') {
      return;
    }

    this.scrollbarWidth = this.getScrollbarWidth();
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

  fixBody() {
    if (typeof window === 'undefined') {
      return;
    }

    this.windowOffsetY = window.pageYOffset;
    document.body.classList.add('not-scrollable');
    document.body.style.top = `-${this.windowOffsetY}px`;
    document.body.style.paddingRight = `${this.scrollbarWidth}px`;
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
}

export default class BaseModal extends React.Component<BaseModalOwnProps> {
  static defaultProps: Partial<BaseModalOwnProps> = {
    closable: false,
    type: undefined,
    renderContent: () => null,
    renderFooter: () => null,
  };

  containerRef = React.createRef<HTMLDivElement>();
  fixBodyService = new FixBodyService();
  lastFocusedElement!: Element;

  componentDidMount() {
    this.fixBodyService.fixBody();

    this.lastFocusedElement = document.activeElement;

    const firstChild = this.containerRef.current && this.containerRef.current.firstChild;
    if (this.elementIsFocusable(firstChild)) {
      firstChild.focus();
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
        className={classNames('app-modal-container', this.props.className)}
        role="dialog"
        tabIndex={0}
        ref={this.containerRef}
      >
        <div className="app-modal">
          {closable && (
            <header className="app-modal--header">
              <button className="app-modal--close" title="Zamknij" onClick={this.close}>
                &times;
              </button>
            </header>
          )}
          <div className="app-modal--content">
            <div className="app-modal--body">
              <div className={classNames('action-icon', 'action-icon_' + type || '')} />
              {renderContent!()}
            </div>
            <footer className="app-modal--footer">{renderFooter!()}</footer>
          </div>
        </div>
      </div>
    );
  }

  private elementIsFocusable(el: Node | null): el is HTMLElement {
    return el ? 'focus' in el : false;
  }

  close: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    this.props.onClose({ event: e });
  };
}
