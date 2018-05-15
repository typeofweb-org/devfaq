import {
  technologyIconItems,
  TechnologyIconItem,
} from '../../../../constants/technology-icon-items';
import * as React from 'react';
import ActiveLink from '../../../activeLink/ActiveLink';
import './technologyFilter.scss';

export class TechnologyFilter extends React.Component {
  render() {
    return (
      <div>
        <h2 className="app-filter--title">Wybierz technologię</h2>
        <ul className="app-filter--technologies">
          {technologyIconItems.map(this.renderTechnologyItem)}
        </ul>
      </div>
    );
  }

  renderTechnologyItem = (technology: TechnologyIconItem) => {
    return (
      <li className="app-filter--technology" key={technology.name}>
        <ActiveLink disabledWhenActive={true} route={'/questions/' + technology.name}>
          <button title={technology.label}>
            <span className="app-filter--technology--label">{technology.label}</span>
            <span className={technology.icon} />
          </button>
        </ActiveLink>
      </li>
    );
  };
}
