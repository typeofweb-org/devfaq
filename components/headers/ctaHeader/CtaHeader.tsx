import * as classNames from 'classnames';
import * as React from 'react';
import './ctaHeader.scss';
import ActiveLink from '../../activeLink/ActiveLink';

const reportEvent = (_t: string) => {};

type CtaHeaderProps = {};
type CtaHeaderState = {
  isDownloadEnabled: boolean;
  downloadUrl: string;
};

class CtaHeader extends React.Component<CtaHeaderProps, CtaHeaderState> {
  state = {
    isDownloadEnabled: false,
    downloadUrl: 'a',
  };

  render() {
    return (
      <div className="cta-header">
        <header className="app-header--cta container">
          <nav role="tablist" className="app-tabs">
            <ActiveLink route="/questions/js" activeClassName="active">
              <a className="app-tabs--tab" onClick={() => reportEvent('Lista pytań')}>
                Lista pytań
              </a>
            </ActiveLink>
            <ActiveLink route="/selected-questions" activeClassName="active">
              <a
                className={classNames('app-tabs--tab', {
                  'has-notification': this.state.isDownloadEnabled,
                })}
                onClick={() =>
                  reportEvent(
                    this.state.isDownloadEnabled ? 'Wybrane pytania' : 'Wybrane pytania (puste)'
                  )
                }
              >
                Wybrane pytania
              </a>
            </ActiveLink>
          </nav>

          <div className="call-to-action-buttons">
            <ActiveLink route={this.state.downloadUrl}>
              <a
                onClick={this.onDownloadClick}
                target="_blank"
                tabIndex={this.state.isDownloadEnabled ? 0 : -1}
                aria-disabled={!this.state.isDownloadEnabled}
                className={classNames('round-button', 'alert-button', {
                  disabled: !this.state.isDownloadEnabled,
                })}
              >
                Pobierz plik PDF
              </a>
            </ActiveLink>
            <button
              className="round-button branding-button-inverse"
              onClick={this.onOpenAddQuestionModalClick}
            >
              Dodaj pytanie
            </button>
          </div>
        </header>
      </div>
    );
  }

  onDownloadClick: React.MouseEventHandler<HTMLElement> = (_event) => {};
  onOpenAddQuestionModalClick: React.MouseEventHandler<HTMLElement> = (_event) => {};
}

export default CtaHeader;
