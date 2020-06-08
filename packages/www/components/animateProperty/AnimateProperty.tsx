import React, { memo, useCallback, useMemo, PropsWithChildren } from 'react';
import { Transition } from 'react-transition-group';

import { updateStyles } from '../../utils/styles';
import type { Nil } from '../../utils/types';

interface AnimateHeightProps {
  in?: boolean;
  enterTime: number;
  exitTime: number;
  nodeRef: React.RefObject<HTMLElement>;
}

export const AnimateHeight = memo<PropsWithChildren<AnimateHeightProps>>(
  ({ enterTime, exitTime, in: isIn, children, nodeRef }) => {
    const reflow = useCallback((el: Nil<HTMLElement>): void => {
      // @ts-ignore
      // reading scrollTop causes reflow of an element
      const _ignore = el?.scrollTop;
      return;
    }, []);

    const isBrowser = !process || !!process.browser;

    const timeout = useMemo(() => ({ enter: enterTime, exit: exitTime }), [enterTime, exitTime]);

    const onExit = useCallback(() => {
      updateStyles(nodeRef.current, {
        willChange: 'height, opacity',
        height: nodeRef.current?.scrollHeight + 'px',
        opacity: '1',
      });
      reflow(nodeRef.current);
    }, [nodeRef, reflow]);

    const onExiting = useCallback(() => {
      updateStyles(nodeRef.current, {
        height: '0',
        opacity: '0',
        minHeight: '0',
        transition: `height ${exitTime}ms, opacity ${exitTime}ms`,
      });
    }, [exitTime, nodeRef]);

    const onExited = useCallback(() => {
      updateStyles(nodeRef.current, {
        height: '',
        opacity: '',
        transition: '',
        minHeight: '',
        willChange: '',
      });
    }, [nodeRef]);

    const onEnter = useCallback(
      (isAppearing: boolean) => {
        updateStyles(nodeRef.current, {
          willChange: 'height, opacity',
          height: '0',
          opacity: '0',
          minHeight: '0',
        });
        reflow(nodeRef.current);
      },
      [nodeRef, reflow]
    );

    const onEntering = useCallback(
      (isAppearing: boolean) => {
        updateStyles(nodeRef.current, {
          height: nodeRef.current?.scrollHeight + 'px',
          opacity: '1',
          transition: `height ${enterTime}ms, opacity ${enterTime}ms`,
        });
      },
      [enterTime, nodeRef]
    );

    const onEntered = useCallback(
      (isAppearing: boolean) => {
        updateStyles(nodeRef.current, {
          height: '',
          opacity: '',
          transition: '',
          minHeight: '',
          willChange: '',
        });
      },
      [nodeRef]
    );

    const addEndListener = useCallback(
      (done: () => void) => {
        nodeRef.current?.addEventListener('transitionend', done, { once: true, passive: true });
      },
      [nodeRef]
    );

    return (
      <Transition
        nodeRef={nodeRef}
        in={isIn}
        timeout={timeout}
        onExit={onExit}
        onExiting={onExiting}
        onExited={onExited}
        onEnter={onEnter}
        onEntering={onEntering}
        onEntered={onEntered}
        addEndListener={addEndListener}
        unmountOnExit={isBrowser}
      >
        {() => children}
      </Transition>
    );
  }
);
