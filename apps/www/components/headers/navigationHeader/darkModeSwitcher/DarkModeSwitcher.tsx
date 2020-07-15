import React from 'react';

import styles from './darkModeSwitcher.module.scss';

const DarkModeSwitcher = () => {
  return (
    <label className={styles.switch}>
      <input type="checkbox" />
    </label>
  );
};

export default DarkModeSwitcher;
