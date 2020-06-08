import React from 'react';

import {
  technologyIconItems,
  TechnologyIconItem,
} from '../../../../constants/technology-icon-items';
import ActiveLink from '../../../activeLink/ActiveLink';
import levelStyles from '../levelFilter/levelFilter.module.scss';

import styles from './technologyFilter.module.scss';

export const TechnologyFilter = () => {
  const renderTechnologyItem = (technology: TechnologyIconItem) => {
    return (
      <li className={styles.appFilterTechnology} key={technology.name}>
        <ActiveLink
          disabledWhenActive={true}
          href="/questions/[technology]"
          query={{ technology: technology.name }}
          onClick={() => reportSelectTechnologyEvent(technology.label)}
          activeClassName={styles.active}
        >
          <a title={technology.label}>
            <span className={styles.appFilterTechnologyLabel}>{technology.label}</span>
            <span className={technology.icon} />
          </a>
        </ActiveLink>
      </li>
    );
  };

  const reportSelectTechnologyEvent = (label: string) => {
    globalReportEvent('Wybierz technologię', 'Lista pytań', label);
  };

  return (
    <div>
      <h2 className={levelStyles.appFilterTitle}>Wybierz technologię</h2>
      <ul className={styles.appFilterTechnologies}>
        {technologyIconItems.map(renderTechnologyItem)}
      </ul>
    </div>
  );
};
