import React, { memo } from 'react';
import { Transition } from 'react-transition-group';

interface AnimateHeightProps {
  in?: boolean;
  enterTime: number;
  exitTime: number;
  nodeRef: React.RefObject<HTMLElement>;
}

export const AnimateHeight: React.FC<AnimateHeightProps> = memo(
  ({ enterTime, exitTime, in: isIn, children, nodeRef }) => {
    const reflow = (el: HTMLElement): void => {
      // @ts-ignore
      const _ignore = el.scrollTop;
      return;
    };

    const isBrowser = !process || !!process.browser;

    return (
      <Transition
        nodeRef={nodeRef}
        in={isIn}
        timeout={{ enter: enterTime, exit: exitTime }}
        onExit={() => {
          if (!nodeRef.current) return;
          nodeRef.current.style.willChange = 'height, opacity';
          nodeRef.current.style.height = nodeRef.current.scrollHeight + 'px';
          nodeRef.current.style.opacity = '1';
          reflow(nodeRef.current);
        }}
        onExiting={() => {
          if (!nodeRef.current) return;
          nodeRef.current.style.height = '0';
          nodeRef.current.style.opacity = '0';
          nodeRef.current.style.minHeight = '0';
          nodeRef.current.style.transition = `height ${exitTime}ms, opacity ${exitTime}ms`;
        }}
        onExited={() => {
          if (!nodeRef.current) return;
          nodeRef.current.style.height = '';
          nodeRef.current.style.opacity = '';
          nodeRef.current.style.transition = '';
          nodeRef.current.style.minHeight = '';
          nodeRef.current.style.willChange = '';
        }}
        onEnter={(isAppearing) => {
          if (!nodeRef.current) return;
          nodeRef.current.style.willChange = 'height, opacity';
          nodeRef.current.style.height = '0';
          nodeRef.current.style.opacity = '0';
          nodeRef.current.style.minHeight = '0';
          reflow(nodeRef.current);
        }}
        onEntering={(isAppearing) => {
          if (!nodeRef.current) return;
          nodeRef.current.style.height = nodeRef.current.scrollHeight + 'px';
          nodeRef.current.style.opacity = '1';
          nodeRef.current.style.transition = `height ${enterTime}ms, opacity ${enterTime}ms`;
        }}
        onEntered={(isAppearing) => {
          if (!nodeRef.current) return;
          nodeRef.current.style.height = '';
          nodeRef.current.style.opacity = '';
          nodeRef.current.style.transition = '';
          nodeRef.current.style.minHeight = '';
          nodeRef.current.style.willChange = '';
        }}
        addEndListener={(done) => {
          if (!nodeRef.current) return;
          nodeRef.current.addEventListener('transitionend', done, { once: true, passive: true });
        }}
        unmountOnExit={isBrowser}
      >
        {() => children}
      </Transition>
    );
  }
);
