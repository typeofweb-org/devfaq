import React from 'react';
import { Transition } from 'react-transition-group';

export class AnimateHeight extends React.PureComponent<{
  in?: boolean;
  enterTime: number;
  exitTime: number;
}> {
  get enterDuration() {
    return `${this.props.enterTime}ms`;
  }

  get exitDuration() {
    return `${this.props.exitTime}ms`;
  }

  render() {
    const { in: isIn, enterTime, exitTime } = this.props;

    const isBrowser = !process || !!process.browser;

    return (
      <Transition
        in={isIn}
        timeout={{ enter: enterTime, exit: exitTime }}
        onExit={(el) => {
          // console.log('onExit');
          el.style.willChange = 'height, opacity';
          el.style.height = el.scrollHeight + 'px';
          el.style.opacity = '1';
          this.reflow(el);
        }}
        onExiting={(el) => {
          // console.log('onExiting');
          el.style.height = '0';
          el.style.opacity = '0';
          el.style.minHeight = '0';
          el.style.transition = `height ${this.exitDuration}, opacity ${this.exitDuration}`;
        }}
        onExited={(el) => {
          // console.log('onExited');
          el.style.height = '';
          el.style.opacity = '';
          el.style.transition = '';
          el.style.minHeight = '';
        }}
        onEnter={(el, isAppearing) => {
          // console.log('onEnter');
          // @ts-ignore
          el.style.willChange = 'height, opacity';
          el.style.height = '0';
          el.style.opacity = '0';
          el.style.minHeight = '0';
          this.reflow(el);
        }}
        onEntering={(el, isAppearing) => {
          // console.log('onEntering');
          el.style.height = el.scrollHeight + 'px';
          el.style.opacity = '1';
          el.style.transition = `height ${this.enterDuration}, opacity ${this.enterDuration}`;
        }}
        onEntered={(el, isAppearing) => {
          // console.log('onEntered');
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
        {() => this.props.children}
      </Transition>
    );
  }
  private reflow(el: HTMLElement): void {
    // @ts-ignore
    const _ignore = el.scrollTop;
    return;
  }
}
