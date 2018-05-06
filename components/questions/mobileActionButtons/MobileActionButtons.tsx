import './mobileActionButtons.scss';
import * as React from 'react';
import { AppState } from '../../../redux/reducers';
import { connect } from 'react-redux';
import * as classNames from 'classnames';

type MobileActionButtonsProps = {
  justDownload: boolean;
};

class MobileActionButtons extends React.Component<
  MobileActionButtonsProps & ReturnType<typeof mapStateToProps>
> {
  render() {
    const { justDownload } = this.props;
    return (
      <div className="mobile-action-buttons">
        {!justDownload && (
          <button
            className="open-sidebar circle-button"
            title="Filtruj wyniki"
            aria-label="Filtruj wyniki"
            onClick={this.openSidebar}
          />
        )}
        {!justDownload && (
          <button
            className="add-question circle-button"
            title="Dodaj pytanie"
            aria-label="Dodaj pytanie"
            onClick={this.openAddQuestionModal}
          />
        )}
        {!justDownload && (
          <a
            className={classNames('download', 'circle-button', {
              disabled: !this.isDownloadEnabled(),
            })}
            title="Pobierz PDF"
            aria-label="Pobierz PDF"
            href={this.getDownloadUrl()}
            onClick={this.onDownloadClick}
            target="_blank"
            tabIndex={this.isDownloadEnabled() ? 0 : -1}
            aria-disabled={!this.isDownloadEnabled()}
          />
        )}
        {justDownload &&
          this.isDownloadEnabled() && (
            <a
              className="round-button alert-button"
              href={this.getDownloadUrl()}
              onClick={this.onDownloadClick}
              target="_blank"
            >
              Pobierz plik PDF
            </a>
          )}
      </div>
    );
  }

  isDownloadEnabled = () => {
    return false;
  };
  getDownloadUrl = () => {
    return 'a';
  };
  openSidebar = () => {};
  openAddQuestionModal = () => {};
  onDownloadClick = () => {};
}

const mapStateToProps = (state: AppState, ownProps: MobileActionButtonsProps) => {
  return {
    ...ownProps,
  };
};

export default connect(mapStateToProps)(MobileActionButtons);
