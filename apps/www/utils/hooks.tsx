import React, { useEffect, EffectCallback, useRef, useCallback, DependencyList } from 'react';

export const useDidMount = (fn: EffectCallback) => {
  const ref = useRef(fn);
  useEffect(() => {
    ref.current = fn;
  }, [fn]);

  useEffect(() => {
    ref.current();
  }, []);
};

export const useDidUpdate = (fn: EffectCallback, deps?: DependencyList) => {
  const ref = useRef(false);

  useEffect(() => {
    if (ref.current) {
      fn();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    ref.current = true;
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
