import React, { useState, useRef, useEffect, memo, useCallback } from 'react';
import { useSelector } from 'react-redux';

import styles from './appSpinner.module.scss';

const SUSPENSE_TIME = 150;

export const AppSpinner = memo(() => {
  const [show, setShow] = useState(false);
  const timerId = useRef<number | undefined>();

  const isLoading = useSelector((state) => state.routeDetails.isTransitioning);

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
