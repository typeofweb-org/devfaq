import classNames from 'classnames';
import React from 'react';
import './ctaHeader.scss';
import ActiveLink from '../../activeLink/ActiveLink';
import { connect } from 'react-redux';
import { AppState } from '../../../redux/reducers/index';
import {
  getAreAnyQuestionSelected,
  getDownloadUrl,
  getIsAdmin,
} from '../../../redux/selectors/selectors';
import { ActionCreators } from '../../../redux/actions';

class CtaHeaderComponent extends React.Component<
  ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps
> {
  render() {
    return (
      <div className="cta-header">
        <header className="app-header--cta container">
          <nav className="app-tabs">
            <ActiveLink href="questions">
              <a onClick={() => this.reportEvent('Lista pytań')} className="app-tabs--tab">
                Lista pytań
              </a>
            </ActiveLink>
            <ActiveLink href="selected-questions">
              <a
                onClick={() =>
                  this.reportEvent(
                    this.props.areAnyQuestionSelected
                      ? 'Wybrane pytania'
                      : 'Wybrane pytania (puste)'
                  )
                }
                className={classNames('app-tabs--tab', {
                  'has-notification': this.props.areAnyQuestionSelected,
                })}
              >
                Wybrane pytania
              </a>
            </ActiveLink>

            {this.props.isAdmin && (
              <ActiveLink href="admin">
                <a className="app-tabs--tab">Admin</a>
              </ActiveLink>
            )}
          </nav>

          <div className="call-to-action-buttons">
            {/* <ActiveLink route={this.props.downloadUrl}>
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
            </ActiveLink> */}
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

  onDownloadClick: React.MouseEventHandler<HTMLElement> = _event => {
    this.reportEvent('Pobierz plik PDF');
    // @todo open DownloadSuccessModal
    // @todo this.analyticsService.reportPdfDownload(this.selectedQuestionsService.getSelectedIds());
  };

  onOpenAddQuestionModalClick: React.MouseEventHandler<HTMLElement> = _event => {
    this.reportEvent('Dodaj pytanie');
    this.props.uiOpenAddQuestionModal();
  };

  reportEvent(action: string) {
    globalReportEvent(action, 'Menu');
  }
}

const mapStateToProps = (state: AppState) => {
  return {
    areAnyQuestionSelected: getAreAnyQuestionSelected(state),
    downloadUrl: getDownloadUrl(state),
    isAdmin: getIsAdmin(state),
  };
};

const mapDispatchToProps = {
  uiOpenAddQuestionModal: ActionCreators.uiOpenAddQuestionModal,
};

const CtaHeader = connect(
  mapStateToProps,
  mapDispatchToProps
)(CtaHeaderComponent);
export default CtaHeader;
