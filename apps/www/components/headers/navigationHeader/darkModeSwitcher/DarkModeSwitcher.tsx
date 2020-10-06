import React, { useCallback, useEffect, useState } from 'react';

import styles from './darkModeSwitcher.module.scss';

const getInitialColorMode = () => {
  if (typeof window === 'undefined') {
    return 'light';
  }

  const persistedColorPreference = window.localStorage.getItem('color-mode');

  if (persistedColorPreference === 'dark' || persistedColorPreference === 'light') {
    return persistedColorPreference;
  }

  const mql = window.matchMedia('(prefers-color-scheme: dark)');
  const hasMediaQueryPreference = typeof mql.matches === 'boolean';
  if (hasMediaQueryPreference) {
    return mql.matches ? 'dark' : 'light';
  }

  return 'light';
};

const DarkModeSwitcher = React.memo(() => {
  const [colorMode, setColorMode] = useState<'light' | 'dark' | undefined>();

  useEffect(() => {
    const html = document.querySelector('html');
    if (colorMode === 'dark') html?.classList.add('theme-dark');
    if (colorMode === 'light') html?.classList.remove('theme-dark');
  }, [colorMode]);

  useEffect(() => {
    const mode = getInitialColorMode();
    setColorMode(mode);
  }, []);

  const handleColorModeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const mode = e.target.checked ? 'dark' : 'light';
    setColorMode(mode);
    window.localStorage.setItem('color-mode', mode);
  }, []);

  return (
    <label className={styles.switch}>
      <input
        onChange={handleColorModeChange}
        type="checkbox"
        aria-label="Switch between Dark and Light mode"
        checked={colorMode === 'dark'}
      />
    </label>
  );
});

export default DarkModeSwitcher;
