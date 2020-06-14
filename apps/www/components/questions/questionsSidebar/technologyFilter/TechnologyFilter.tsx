import React, { useCallback, memo } from 'react';

import {
  technologyIconItems,
  TechnologyIconItem,
} from '../../../../constants/technology-icon-items';
import { ActiveLink } from '../../../activeLink/ActiveLink';
import levelStyles from '../levelFilter/levelFilter.module.scss';

import styles from './technologyFilter.module.scss';

const TechnologyItem = memo<{ technology: TechnologyIconItem }>(({ technology }) => {
  const reportSelectTechnologyEvent = useCallback(() => {
    globalReportEvent('Wybierz technologię', 'Lista pytań', technology.label);
  }, [technology.label]);

  return (
    <li className={styles.appFilterTechnology} key={technology.name}>
      <ActiveLink
        disabledWhenActive={true}
        href="/questions/[technology]"
        query={{ technology: technology.name }}
        onClick={reportSelectTechnologyEvent}
        activeClassName={styles.active}
      >
        <a title={technology.label}>
          <span className={styles.appFilterTechnologyLabel}>{technology.label}</span>
          <span className={technology.icon} />
        </a>
      </ActiveLink>
    </li>
  );
});

export const TechnologyFilter = memo(() => {
  return (
    <div>
      <h2 className={levelStyles.appFilterTitle}>Wybierz technologię</h2>
      <ul className={styles.appFilterTechnologies}>
        {technologyIconItems.map((technology) => (
          <TechnologyItem key={technology.name} technology={technology} />
        ))}
      </ul>
    </div>
  );
});
