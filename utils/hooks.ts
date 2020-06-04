import { useEffect, EffectCallback } from 'react';

export const useDidMount = (fn: EffectCallback) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(fn, []);
};

export const useWillUnmount = (fn: ReturnType<EffectCallback>) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => fn, []);
};
