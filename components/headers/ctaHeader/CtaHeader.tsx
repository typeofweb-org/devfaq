import * as classNames from 'classnames';
import * as React from 'react';
import './ctaHeader.scss';
import ActiveLink from '../../activeLink/ActiveLink';
import { connect } from 'react-redux';
import { AppState } from '../../../redux/reducers/index';
import { getAreAnyQuestionSelected, getDownloadUrl } from '../../../redux/selectors/selectors';

const reportEvent = (_t: string) => {};

class CtaHeaderComponent extends React.Component<ReturnType<typeof mapStateToProps>> {
  render() {
    return (
      <div className="cta-header">
        <header className="app-header--cta container">
          <nav className="app-tabs">
            <ActiveLink route="/questions">
              <a className="app-tabs--tab" onClick={() => reportEvent('Lista pytań')}>
                Lista pytań
              </a>
            </ActiveLink>
            <ActiveLink route="/selected-questions">
              <a
                className={classNames('app-tabs--tab', {
                  'has-notification': this.props.areAnyQuestionSelected,
                })}
                onClick={() =>
                  reportEvent(this.props.areAnyQuestionSelected ? 'Wybrane pytania' : 'Wybrane pytania (puste)')
                }
              >
                Wybrane pytania
              </a>
            </ActiveLink>
          </nav>

          <div className="call-to-action-buttons">
            <ActiveLink route={this.props.downloadUrl}>
              <a
                onClick={this.onDownloadClick}
                target="_blank"
                tabIndex={this.props.areAnyQuestionSelected ? 0 : -1}
                aria-disabled={!this.props.areAnyQuestionSelected}
                className={classNames('round-button', 'alert-button', {
                  disabled: !this.props.areAnyQuestionSelected,
                })}
              >
                Pobierz plik PDF
              </a>
            </ActiveLink>
            <button className="round-button branding-button-inverse" onClick={this.onOpenAddQuestionModalClick}>
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

const mapStateToProps = (state: AppState) => {
  return {
    areAnyQuestionSelected: getAreAnyQuestionSelected(state),
    downloadUrl: getDownloadUrl(state),
  };
};

const CtaHeader = connect(mapStateToProps)(CtaHeaderComponent);
export default CtaHeader;
