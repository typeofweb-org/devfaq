import * as React from 'react';
import { Transition } from 'react-transition-group';
import { EndHandler, EnterHandler, ExitHandler } from 'react-transition-group/Transition';

export class AnimateHeight extends React.Component<{ in?: boolean; time: number }> {
  private reflow(el: HTMLElement): void {
    // @ts-ignore
    const _ignore = el.scrollTop;
    return;
  }

  get duration() {
    return `${this.props.time}ms`;
  }

  onExit: ExitHandler = (el) => {
    // console.log('onExit');
    (el.style as any).willChange = 'height, opacity';
    el.style.height = el.scrollHeight + 'px';
    el.style.opacity = '1';
    this.reflow(el);
  };

  onExiting: ExitHandler = (el) => {
    // console.log('onExiting');
    el.style.height = '0';
    el.style.opacity = '0';
    el.style.transition = `height ${this.duration}, opacity ${this.duration}`;
  };

  onExited: ExitHandler = (el) => {
    // console.log('onExited');
    el.style.height = '';
    el.style.opacity = '';
    el.style.transition = '';
  };

  onEnter: EnterHandler = (el) => {
    // console.log('onEnter');
    (el.style as any).willChange = 'height, opacity';
    el.style.height = '0';
    el.style.opacity = '0';
    this.reflow(el);
  };

  onEntering: EnterHandler = (el) => {
    // console.log('onEntering');
    el.style.height = el.scrollHeight + 'px';
    el.style.opacity = '1';
    el.style.transition = `height ${this.duration}, opacity ${this.duration}`;
  };

  onEntered: EnterHandler = (el) => {
    // console.log('onEntered');
    el.style.height = '';
    el.style.opacity = '';
    el.style.transition = '';
  };

  addEndListener: EndHandler = (el, done) => {
    // console.log('addEndListener');
    el.addEventListener('transitionend', () => done(), { once: true, passive: true });
  };

  render() {
    const { in: isIn, time } = this.props;

    // @ts-ignore
    const isBrowser = !process || !!process['browser'];

    return (
      <Transition
        in={isIn}
        timeout={time}
        onExit={this.onExit}
        onExiting={this.onExiting}
        onExited={this.onExited}
        onEnter={this.onEnter}
        onEntering={this.onEntering}
        onEntered={this.onEntered}
        addEndListener={this.addEndListener}
        unmountOnExit={isBrowser}
      >
        {() => this.props.children}
      </Transition>
    );
  }
}
