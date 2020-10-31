import classNames from 'classnames';
import React from 'react';
import { connect } from 'react-redux';

import { useUIContext } from '../../../contexts/UIContextProvider';
import { AppState } from '../../../redux/reducers';
import { getAreAnyQuestionSelected, getDownloadUrl } from '../../../redux/selectors/selectors';

import styles from './mobileActionButtons.module.scss';

interface MobileActionButtonsProps {
  justDownload: boolean;
}

const MobileActionButtonsComponent = React.memo<
  MobileActionButtonsProps & ReturnType<typeof mapStateToProps>
>(({ justDownload }) => {
  const { openSideBar, openAddQuestionModal } = useUIContext();
  const onDownloadClick = () => {
    // @todo
  };
  return (
    <div className={styles.mobileActionButtons}>
      {!justDownload && (
        <button
          className={classNames(styles.openSidebar, 'circle-button')}
          title="Filtruj wyniki"
          aria-label="Filtruj wyniki"
          onClick={openSideBar}
        />
      )}
      {!justDownload && (
        <button
          className={classNames(styles.addQuestion, 'circle-button')}
          title="Dodaj pytanie"
          aria-label="Dodaj pytanie"
          onClick={openAddQuestionModal}
        />
      )}
      {/* {!justDownload && (
          <a
            className={classNames('download', 'circle-button', {
              disabled: !areAnyQuestionSelected,
            })}
            title="Pobierz PDF"
            aria-label="Pobierz PDF"
            href={downloadUrl}
            onClick={onDownloadClick}
            target="_blank"
            tabIndex={areAnyQuestionSelected ? 0 : -1}
            aria-disabled={!areAnyQuestionSelected}
          />
        )}
        {justDownload && areAnyQuestionSelected && (
          <a
            className="round-button alert-button"
            href={downloadUrl}
            onClick={onDownloadClick}
            target="_blank"
          >
            Pobierz plik PDF
          </a>
        )} */}
    </div>
  );
});

const mapStateToProps = (state: AppState) => {
  return {
    areAnyQuestionSelected: getAreAnyQuestionSelected(state),
    downloadUrl: getDownloadUrl(state),
  };
};

const MobileActionButtons = connect(mapStateToProps)(MobileActionButtonsComponent);
export default MobileActionButtons;
