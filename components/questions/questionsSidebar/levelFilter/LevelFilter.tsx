import { levelsWithLabels, LevelWithLabel } from '../../../../constants/level';
import React from 'react';
import classNames from 'classnames';
import './levelFilter.scss';
import { connect } from 'react-redux';
import { AppState } from '../../../../redux/reducers/index';
import { ActionCreators } from '../../../../redux/actions';
import { getPage } from '../../../../redux/selectors/selectors';
import Router from 'next/router';
import { redirect } from '../../../../utils/redirect';

class LevelFilterComponent extends React.Component<
  ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps
> {
  render() {
    return (
      <div>
        <h2 className="app-filter--title">Wybierz poziom</h2>
        <ul className="app-filter--levels">{levelsWithLabels.map(this.renderLevel)}</ul>
      </div>
    );
  }

  renderLevel = (level: LevelWithLabel) => {
    return (
      <li
        key={level.value}
        className={classNames('app-filter--level', `app-filter--level_${level.value}`, {
          active: this.isSelected(level),
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

const LevelFilter = connect(
  mapStateToProps,
  mapDispatchToProps
)(LevelFilterComponent);

export default LevelFilter;
