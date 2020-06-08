import classNames from 'classnames';
import React, { memo } from 'react';
import { connect } from 'react-redux';

import { ActionCreators } from '../../../redux/actions';
import { AppState } from '../../../redux/reducers/index';
import {
  getAreAnyQuestionSelected,
  getDownloadUrl,
  getIsAdmin,
} from '../../../redux/selectors/selectors';
import ActiveLink from '../../activeLink/ActiveLink';
import { Container } from '../../container/Container';

import styles from './ctaHeader.module.scss';

export const CtaHeaderComponent: React.FC<
  ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps
> = memo(({ uiOpenAddQuestionModal, areAnyQuestionSelected, isAdmin }) => {
  const onDownloadClick: React.MouseEventHandler<HTMLElement> = (_event) => {
    reportEvent('Pobierz plik PDF');
    // @todo open DownloadSuccessModal
    // @todo this.analyticsService.reportPdfDownload(this.selectedQuestionsService.getSelectedIds());
  };

  const onOpenAddQuestionModalClick: React.MouseEventHandler<HTMLElement> = (_event) => {
    reportEvent('Dodaj pytanie');
    uiOpenAddQuestionModal();
  };

  const reportEvent = (action: string) => {
    globalReportEvent(action, 'Menu');
  };
  return (
    <div className={classNames('app-cta-header', styles.ctaHeader)}>
      <Container as="header" className={styles.appHeaderCta}>
        <nav className={styles.appTabs}>
          <ActiveLink href="/questions" activeClassName={styles.active}>
            <a onClick={() => reportEvent('Lista pytań')} className={styles.appTabsTab}>
              Lista pytań
            </a>
          </ActiveLink>
          <ActiveLink href="/selected-questions" activeClassName={styles.active}>
            <a
              onClick={() =>
                reportEvent(areAnyQuestionSelected ? 'Wybrane pytania' : 'Wybrane pytania (puste)')
              }
              className={classNames(styles.appTabsTab, {
                [styles.hasNotification]: areAnyQuestionSelected,
              })}
            >
              Wybrane pytania
            </a>
          </ActiveLink>

          {isAdmin && (
            <ActiveLink href="/admin" activeClassName={styles.active}>
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
            onClick={onOpenAddQuestionModalClick}
          >
            Dodaj pytanie
          </button>
        </div>
      </Container>
    </div>
  );
});

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

export const CtaHeader = connect(mapStateToProps, mapDispatchToProps)(CtaHeaderComponent);
