import React, { useState, useRef, useEffect } from 'react';
import styles from './appSpinner.module.scss';
import { connect } from 'react-redux';
import { AppState } from '../../redux/reducers';

const SUSPENSE_TIME = 150;

const AppSpinnerComponent: React.FC<ReturnType<typeof mapStateToProps>> = React.memo(
  ({ isLoading }) => {
    const [show, setShow] = useState(false);
    let timerId = useRef<number | undefined>();

    const startTimer = () => {
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
    };
    const stopTimer = () => {
      window.clearTimeout(timerId.current);
      timerId.current = undefined;
    };

    useEffect(() => {
      startTimer();
      return () => stopTimer();
    }, [startTimer, stopTimer, isLoading]);

    return show ? <div className={styles.spinner} /> : null;
  }
);

const mapStateToProps = (state: AppState) => {
  return {
    isLoading: state.routeDetails.isTransitioning,
  };
};

const AppSpinner = connect(mapStateToProps)(AppSpinnerComponent);
export default AppSpinner;
