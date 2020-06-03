import classNames from 'classnames';
import React from 'react';
import { connect } from 'react-redux';

import { levelsWithLabels, LevelWithLabel } from '../../../../constants/level';
import { ActionCreators } from '../../../../redux/actions';
import { AppState } from '../../../../redux/reducers/index';
import { getPage } from '../../../../redux/selectors/selectors';
import { redirect } from '../../../../utils/redirect';

import styles from './levelFilter.module.scss';

class LevelFilterComponent extends React.Component<
  ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps
> {
  render() {
    return (
      <div>
        <h2 className={styles['app-filter--title']}>Wybierz poziom</h2>
        <ul className={styles.appFilterLevels}>{levelsWithLabels.map(this.renderLevel)}</ul>
      </div>
    );
  }

  renderLevel = (level: LevelWithLabel) => {
    const className = ('app-filter--level_' + level.value) as
      | 'app-filter--level_junior'
      | 'app-filter--level_mid'
      | 'app-filter--level_senior';
    return (
      <li
        key={level.value}
        className={classNames(styles.appFilterLevel, styles[className], {
          [styles.active]: this.isSelected(level),
        })}
      >
        <button onClick={() => this.toggleSelectedLevel(level)}>{level.label}</button>
      </li>
    );
  };

  isSelected = (level: LevelWithLabel): boolean => {
    return this.props.selectedLevels.includes(level.value);
  };

  toggleSelectedLevel = (level: LevelWithLabel) => {
    if (this.isSelected(level)) {
      this.props.deselectLevel(level.value);
    } else {
      globalReportEvent('Wybierz poziom', 'Lista pytań', level.label);
      this.props.selectLevel(level.value);
    }
    if (this.props.page !== 1) {
      redirect('/questions', { page: '1' });
    }
  };
}

const mapStateToProps = (state: AppState) => {
  return {
    selectedLevels: state.selectedLevels,
    page: getPage(state),
    route: state.routeDetails.current,
  };
};

const mapDispatchToProps = {
  selectLevel: ActionCreators.selectLevel,
  deselectLevel: ActionCreators.deselectLevel,
};

const LevelFilter = connect(mapStateToProps, mapDispatchToProps)(LevelFilterComponent);

export default LevelFilter;
