import Router from 'next/router';

type RouterEventListeners = {
  onRouteChangeStart(...args: any[]): void;
  onBeforeHistoryChange(...args: any[]): void;
  onRouteChangeComplete(...args: any[]): void;
  onRouteChangeError(...args: any[]): void;
};

type RouterEvents = keyof RouterEventListeners;

const listeners: { [K in RouterEvents]: Array<RouterEventListeners[K]> } = {
  onRouteChangeStart: [],
  onBeforeHistoryChange: [],
  onRouteChangeComplete: [],
  onRouteChangeError: [],
};

const handleEvent = <T extends RouterEvents = RouterEvents>(event: T): RouterEventListeners[T] => (...args: any[]) => {
  for (const listener of listeners[event]) {
    listener(...args);
  }
};

Router.onRouteChangeStart = handleEvent('onRouteChangeStart');
Router.onBeforeHistoryChange = handleEvent('onBeforeHistoryChange');
Router.onRouteChangeComplete = handleEvent('onRouteChangeComplete');
Router.onRouteChangeError = handleEvent('onRouteChangeError');

export const addRouterEventListener = (event: RouterEvents, fn: typeof Router[typeof event]) => {
  if (!fn) {
    throw new Error('Please provide a callback function');
  }
  listeners[event].push(fn);
};

export const removeRouterEventListener = (event: RouterEvents, fn: typeof Router[typeof event]) => {
  if (!fn) {
    throw new Error('Please provide a callback function');
  }
  const lengthBefore = listeners[event].length;
  listeners[event] = listeners[event].filter((callback) => callback !== fn);
  const lengthAfter = listeners[event].length;

  if (lengthBefore === lengthAfter) {
    console.warn('removeRouterEventListener did not remove anything', event, fn);
  }
};
