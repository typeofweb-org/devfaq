import React, { memo } from 'react';
import { Transition } from 'react-transition-group';

interface AnimateHeightProps {
  in?: boolean;
  enterTime: number;
  exitTime: number;
}

export const AnimateHeight: React.FC<AnimateHeightProps> = memo(
  ({ enterTime, exitTime, in: isIn, children }) => {
    const reflow = (el: HTMLElement): void => {
      // @ts-ignore
      const _ignore = el.scrollTop;
      return;
    };

    const isBrowser = !process || !!process.browser;

    return (
      <Transition
        in={isIn}
        timeout={{ enter: enterTime, exit: exitTime }}
        onExit={(el) => {
          el.style.willChange = 'height, opacity';
          el.style.height = el.scrollHeight + 'px';
          el.style.opacity = '1';
          reflow(el);
        }}
        onExiting={(el) => {
          console.log(el);
          el.style.height = '0';
          el.style.opacity = '0';
          el.style.minHeight = '0';
          el.style.transition = `height ${exitTime}ms, opacity ${exitTime}ms`;
        }}
        onExited={(el) => {
          el.style.height = '';
          el.style.opacity = '';
          el.style.transition = '';
          el.style.minHeight = '';
        }}
        onEnter={(el, isAppearing) => {
          // @ts-ignore
          el.style.willChange = 'height, opacity';
          el.style.height = '0';
          el.style.opacity = '0';
          el.style.minHeight = '0';
          reflow(el);
        }}
        onEntering={(el, isAppearing) => {
          el.style.height = el.scrollHeight + 'px';
          el.style.opacity = '1';
          el.style.transition = `height ${enterTime}ms, opacity ${enterTime}ms`;
        }}
        onEntered={(el, isAppearing) => {
          el.style.height = '';
          el.style.opacity = '';
          el.style.transition = '';
          el.style.minHeight = '';
        }}
        addEndListener={(el, done) => {
          el.addEventListener('transitionend', done, { once: true, passive: true });
        }}
        unmountOnExit={isBrowser}
      >
        {() => children}
      </Transition>
    );
  }
);
