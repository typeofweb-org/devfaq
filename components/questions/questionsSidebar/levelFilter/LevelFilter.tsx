import classNames from 'classnames';
import React, { memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { levelsWithLabels, LevelWithLabel } from '../../../../constants/level';
import { ActionCreators } from '../../../../redux/actions';
import { getPage } from '../../../../redux/selectors/selectors';
import { redirect } from '../../../../utils/redirect';

import styles from './levelFilter.module.scss';

export default memo(() => {
  const dispatch = useDispatch();
  const selectedLevels = useSelector((state) => state.selectedLevels);
  const page = useSelector(getPage);

  const renderLevel = (level: LevelWithLabel) => {
    const className = ('app-filter--level_' + level.value) as
      | 'app-filter--level_junior'
      | 'app-filter--level_mid'
      | 'app-filter--level_senior';
    return (
      <li
        key={level.value}
        className={classNames(styles.appFilterLevel, styles[className], {
          [styles.active]: isSelected(level),
        })}
      >
        <button onClick={() => toggleSelectedLevel(level)}>{level.label}</button>
      </li>
    );
  };

  const isSelected = (level: LevelWithLabel): boolean => {
    return selectedLevels.includes(level.value);
  };

  const toggleSelectedLevel = (level: LevelWithLabel) => {
    if (isSelected(level)) {
      dispatch(ActionCreators.deselectLevel(level.value));
    } else {
      globalReportEvent('Wybierz poziom', 'Lista pytań', level.label);
      dispatch(ActionCreators.selectLevel(level.value));
    }
    if (page !== 1) {
      redirect('/questions', { page: '1' });
    }
  };
  return (
    <div>
      <h2 className={styles['app-filter--title']}>Wybierz poziom</h2>
      <ul className={styles.appFilterLevels}>{levelsWithLabels.map(renderLevel)}</ul>
    </div>
  );
});
