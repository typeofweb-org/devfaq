import classNames from 'classnames';
import React, { memo } from 'react';

import styles from './container.module.scss';

/**
 * @default as="div"
 */
export const Container: React.FC<{
  className?: string;
  as?: 'div' | 'main' | 'section' | 'article' | 'footer' | 'header';
}> = memo(({ className, children, as: As = 'div' }) => {
  return <As className={classNames(styles.container, className)}>{children}</As>;
});
