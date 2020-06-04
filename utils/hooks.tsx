import React, { useEffect, EffectCallback, useRef, useCallback } from 'react';

export const useDidMount = (fn: EffectCallback) => {
  const ref = useRef(fn);
  useEffect(() => {
    ref.current = fn;
  }, [fn]);

  useEffect(() => {
    ref.current();
  }, []);
};

export const useWillUnmount = (fn: ReturnType<EffectCallback>) => {
  const ref = useRef(fn);
  useEffect(() => {
    ref.current = fn;
  }, [fn]);

  useEffect(() => ref.current, []);
};

export const useRenderProp = <Props,>(Component: React.ComponentType<Props>, props: Props) => {
  return useCallback((): React.FunctionComponentElement<Props> => {
    return <Component {...props} />;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...Object.values(props)]);
};
