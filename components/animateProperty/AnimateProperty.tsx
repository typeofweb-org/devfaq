import React, { memo, useCallback, useMemo, PropsWithChildren } from 'react';
import { Transition } from 'react-transition-group';

interface AnimateHeightProps {
  in?: boolean;
  enterTime: number;
  exitTime: number;
  nodeRef: React.RefObject<HTMLElement>;
}

export const AnimateHeight = memo<PropsWithChildren<AnimateHeightProps>>(
  ({ enterTime, exitTime, in: isIn, children, nodeRef }) => {
    const reflow = useCallback((el: HTMLElement): void => {
      // @ts-ignore
      // reading scrollTop causes reflow of an element
      const _ignore = el.scrollTop;
      return;
    }, []);

    const isBrowser = !process || !!process.browser;

    const timeout = useMemo(() => ({ enter: enterTime, exit: exitTime }), [enterTime, exitTime]);

    const onExit = useCallback(() => {
      if (!nodeRef.current) return;
      nodeRef.current.style.willChange = 'height, opacity';
      nodeRef.current.style.height = nodeRef.current.scrollHeight + 'px';
      nodeRef.current.style.opacity = '1';
      reflow(nodeRef.current);
    }, [nodeRef, reflow]);

    const onExiting = useCallback(() => {
      if (!nodeRef.current) return;
      nodeRef.current.style.height = '0';
      nodeRef.current.style.opacity = '0';
      nodeRef.current.style.minHeight = '0';
      nodeRef.current.style.transition = `height ${exitTime}ms, opacity ${exitTime}ms`;
    }, [exitTime, nodeRef]);

    const onExited = useCallback(() => {
      if (!nodeRef.current) return;
      nodeRef.current.style.height = '';
      nodeRef.current.style.opacity = '';
      nodeRef.current.style.transition = '';
      nodeRef.current.style.minHeight = '';
      nodeRef.current.style.willChange = '';
    }, [nodeRef]);

    const onEnter = useCallback(
      (isAppearing: boolean) => {
        if (!nodeRef.current) return;
        nodeRef.current.style.willChange = 'height, opacity';
        nodeRef.current.style.height = '0';
        nodeRef.current.style.opacity = '0';
        nodeRef.current.style.minHeight = '0';
        reflow(nodeRef.current);
      },
      [nodeRef, reflow]
    );

    const onEntering = useCallback(
      (isAppearing: boolean) => {
        if (!nodeRef.current) return;
        nodeRef.current.style.height = nodeRef.current.scrollHeight + 'px';
        nodeRef.current.style.opacity = '1';
        nodeRef.current.style.transition = `height ${enterTime}ms, opacity ${enterTime}ms`;
      },
      [enterTime, nodeRef]
    );

    const onEntered = useCallback(
      (isAppearing: boolean) => {
        if (!nodeRef.current) return;
        nodeRef.current.style.height = '';
        nodeRef.current.style.opacity = '';
        nodeRef.current.style.transition = '';
        nodeRef.current.style.minHeight = '';
        nodeRef.current.style.willChange = '';
      },
      [nodeRef]
    );

    const addEndListener = useCallback(
      (done: () => void) => {
        if (!nodeRef.current) return;
        nodeRef.current.addEventListener('transitionend', done, { once: true, passive: true });
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
