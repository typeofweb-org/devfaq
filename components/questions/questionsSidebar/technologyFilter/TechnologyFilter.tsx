import React from 'react';

import {
  technologyIconItems,
  TechnologyIconItem,
} from '../../../../constants/technology-icon-items';
import ActiveLink from '../../../activeLink/ActiveLink';
import levelStyles from '../levelFilter/levelFilter.module.scss';

import styles from './technologyFilter.module.scss';

export class TechnologyFilter extends React.Component {
  render() {
    return (
      <div>
        <h2 className={levelStyles.appFilterTitle}>Wybierz technologię</h2>
        <ul className={styles.appFilterTechnologies}>
          {technologyIconItems.map(this.renderTechnologyItem)}
        </ul>
      </div>
    );
  }

  renderTechnologyItem = (technology: TechnologyIconItem) => {
    return (
      <li className={styles.appFilterTechnology} key={technology.name}>
        <ActiveLink
          disabledWhenActive={true}
          href="/questions/[technology]"
          query={{ technology: technology.name }}
          onClick={() => this.reportSelectTechnologyEvent(technology.label)}
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

  reportSelectTechnologyEvent(label: string) {
    globalReportEvent('Wybierz technologię', 'Lista pytań', label);
  }
}
