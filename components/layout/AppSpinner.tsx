import React, { useState, useRef, useEffect, memo, useCallback } from 'react';
import { connect } from 'react-redux';

import { AppState } from '../../redux/reducers';

import styles from './appSpinner.module.scss';

const SUSPENSE_TIME = 150;

const AppSpinnerComponent: React.FC<ReturnType<typeof mapStateToProps>> = memo(({ isLoading }) => {
  const [show, setShow] = useState(false);
  const timerId = useRef<number | undefined>();

  const stopTimer = useCallback(() => {
    window.clearTimeout(timerId.current);
    timerId.current = undefined;
  }, []);

  const startTimer = useCallback(() => {
    if (isLoading) {
      if (!timerId.current && !show) {
        timerId.current = window.setTimeout(() => {
          setShow(true);
        }, SUSPENSE_TIME);
      }
    } else {
      stopTimer();
      if (show) {
        setShow(false);
      }
    }
  }, [isLoading, show, stopTimer]);

  useEffect(() => {
    startTimer();
    return stopTimer;
  }, [startTimer, stopTimer]);

  return show ? <div className={styles.spinner} /> : null;
});

const mapStateToProps = (state: AppState) => {
  return {
    isLoading: state.routeDetails.isTransitioning,
  };
};

const AppSpinner = connect(mapStateToProps)(AppSpinnerComponent);
export default AppSpinner;
