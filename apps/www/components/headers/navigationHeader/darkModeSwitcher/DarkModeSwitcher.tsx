import React, { useCallback, useEffect, useState } from 'react';

import styles from './darkModeSwitcher.module.scss';

type ColorMode = 'light' | 'dark';

export function initializeColorMode() {
  try {
    setColorModeClass(document.querySelector('html')!, getBrowserColorMode());
  } catch {}
}

export function getBrowserColorMode() {
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
}

export function setColorModeClass(target: HTMLElement, colorMode: ColorMode) {
  if (colorMode === 'dark') {
    target?.classList.add('theme-dark');
  } else {
    target?.classList.remove('theme-dark');
  }
}

const DarkModeSwitcher = React.memo(() => {
  const [colorMode, setColorMode] = useState<ColorMode>(() => getBrowserColorMode());

  useEffect(() => {
    const html = document.querySelector('html')!;
    setColorModeClass(html, colorMode);
  }, [colorMode]);

  const handleColorModeChange = useCallback<React.ChangeEventHandler<HTMLInputElement>>((e) => {
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
