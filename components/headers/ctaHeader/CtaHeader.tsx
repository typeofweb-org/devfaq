import classNames from 'classnames';
import React from 'react';
import styles from './ctaHeader.module.scss';
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
      <div className={styles.ctaHeader}>
        <header className={classNames(styles.appHeaderCta, 'container')}>
          <nav className={styles.appTabs}>
            <ActiveLink href="/questions">
              <a onClick={() => this.reportEvent('Lista pytań')} className={styles.appTabsTab}>
                Lista pytań
              </a>
            </ActiveLink>
            <ActiveLink href="/selected-questions">
              <a
                onClick={() =>
                  this.reportEvent(
                    this.props.areAnyQuestionSelected
                      ? 'Wybrane pytania'
                      : 'Wybrane pytania (puste)'
                  )
                }
                className={classNames(styles.appTabsTab, {
                  'has-notification': this.props.areAnyQuestionSelected,
                })}
              >
                Wybrane pytania
              </a>
            </ActiveLink>

            {this.props.isAdmin && (
              <ActiveLink href="/admin">
                <a className={styles.appTabsTab}>Admin</a>
              </ActiveLink>
            )}
          </nav>

          <div className={styles.callToActionButtons}>
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
              className={classNames(styles.roundButton, 'round-button', 'branding-button-inverse')}
              onClick={this.onOpenAddQuestionModalClick}
            >
              Dodaj pytanie
            </button>
          </div>
        </header>
      </div>
    );
  }

  onDownloadClick: React.MouseEventHandler<HTMLElement> = (_event) => {
    this.reportEvent('Pobierz plik PDF');
    // @todo open DownloadSuccessModal
    // @todo this.analyticsService.reportPdfDownload(this.selectedQuestionsService.getSelectedIds());
  };

  onOpenAddQuestionModalClick: React.MouseEventHandler<HTMLElement> = (_event) => {
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

const CtaHeader = connect(mapStateToProps, mapDispatchToProps)(CtaHeaderComponent);
export default CtaHeader;
