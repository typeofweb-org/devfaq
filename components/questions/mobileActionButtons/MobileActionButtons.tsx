import './mobileActionButtons.scss';
import * as React from 'react';
import { AppState } from '../../../redux/reducers';
import { connect } from 'react-redux';
import * as classNames from 'classnames';
import { ActionCreators } from '../../../redux/actions';
import {
  isDownloadEnabledSelector,
  getDownloadUrlSelector,
} from '../../../redux/selectors/selectors';

type MobileActionButtonsProps = {
  justDownload: boolean;
};

class MobileActionButtonsComponent extends React.Component<
  MobileActionButtonsProps & ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps
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
            onClick={this.props.uiOpenSidebar}
          />
        )}
        {!justDownload && (
          <button
            className="add-question circle-button"
            title="Dodaj pytanie"
            aria-label="Dodaj pytanie"
            onClick={this.props.uiOpenAddQuestionModal}
          />
        )}
        {!justDownload && (
          <a
            className={classNames('download', 'circle-button', {
              disabled: !this.props.isDownloadEnabled,
            })}
            title="Pobierz PDF"
            aria-label="Pobierz PDF"
            href={this.props.downloadUrl}
            onClick={this.onDownloadClick}
            target="_blank"
            tabIndex={this.props.isDownloadEnabled ? 0 : -1}
            aria-disabled={!this.props.isDownloadEnabled}
          />
        )}
        {justDownload &&
          this.props.isDownloadEnabled && (
            <a
              className="round-button alert-button"
              href={this.props.downloadUrl}
              onClick={this.onDownloadClick}
              target="_blank"
            >
              Pobierz plik PDF
            </a>
          )}
      </div>
    );
  }
  onDownloadClick = () => {};
}

const mapStateToProps = (state: AppState) => {
  return {
    isDownloadEnabled: isDownloadEnabledSelector(state),
    downloadUrl: getDownloadUrlSelector(state),
  };
};

const mapDispatchToProps = {
  uiOpenSidebar: ActionCreators.uiOpenSidebar,
  uiOpenAddQuestionModal: ActionCreators.uiOpenAddQuestionModal,
};

const MobileActionButtons = connect(mapStateToProps, mapDispatchToProps)(
  MobileActionButtonsComponent
);
export default MobileActionButtons;
