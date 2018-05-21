import * as React from 'react';
import * as classNames from 'classnames';
import './baseModal.scss';

export type ModalType = 'warning' | 'confirmation' | 'thumbs-up' | 'add';

type BaseModalOwnProps = {
  closable?: boolean;
  type?: ModalType;
  renderContent?(): React.ReactNode;
  renderFooter?(): React.ReactNode;
  className: string;
};

class FixBodyService {
  private windowOffsetY = 0;

  fixBody() {
    this.windowOffsetY = window.pageYOffset;
    document.body.classList.add('not-scrollable');
    document.body.style.top = `-${this.windowOffsetY}px`;
  }

  unfixBody() {
    document.body.classList.remove('not-scrollable');
    window.scrollTo(0, this.windowOffsetY);
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

  close = (_e: React.MouseEvent<HTMLButtonElement>) => {};
}
