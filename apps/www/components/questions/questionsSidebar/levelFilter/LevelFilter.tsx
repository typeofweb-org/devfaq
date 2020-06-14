import classNames from 'classnames';
import React, { memo, useCallback } from 'react';

import { levelsWithLabels, LevelWithLabel, LevelKey } from '../../../../constants/level';
import { useQuestionsFilter } from '../../../../utils/useFilter';

import styles from './levelFilter.module.scss';

const isLevelSelected = (level: LevelWithLabel, selectedLevels?: LevelKey[]) =>
  selectedLevels && selectedLevels.includes(level.value);

export const LevelFilter = memo(() => {
  const filter = useQuestionsFilter();
  const { selectedLevels } = filter.selected;

  const isSelected = useCallback(
    (level: LevelWithLabel) => Boolean(isLevelSelected(level, selectedLevels)),
    [selectedLevels]
  );

  const toggleSelectedLevel = useCallback(
    (level: LevelWithLabel) => {
      if (isSelected(level)) {
        const newLevels = (selectedLevels || []).filter((l) => l !== level.value);
        filter.updateFilter({ selectedLevels: newLevels, page: 1 });
      } else {
        globalReportEvent('Wybierz poziom', 'Lista pytań', level.label);
        filter.updateFilter({
          selectedLevels: [...(selectedLevels || []), level.value],
          page: 1,
        });
      }
    },
    [filter, isSelected, selectedLevels]
  );

  return (
    <div>
      <h2 className={styles.appFilterTitle}>Wybierz poziom</h2>
      <ul className={styles.appFilterLevels}>
        {levelsWithLabels.map((level) => (
          <LevelItem
            key={level.value}
            level={level}
            isActive={isSelected(level)}
            toggleSelectedLevel={toggleSelectedLevel}
          />
        ))}
      </ul>
    </div>
  );
});

const LevelItem = memo<{
  level: LevelWithLabel;
  isActive: boolean;
  toggleSelectedLevel: (level: LevelWithLabel) => void;
}>(({ level, isActive, toggleSelectedLevel }) => {
  const className = ('app-filter--level_' + level.value) as
    | 'app-filter--level_junior'
    | 'app-filter--level_mid'
    | 'app-filter--level_senior';

  const toggle = useCallback(() => toggleSelectedLevel(level), [level, toggleSelectedLevel]);

  return (
    <li
      key={level.value}
      className={classNames(styles.appFilterLevel, styles[className], {
        [styles.active]: isActive,
      })}
    >
      <button onClick={toggle}>{level.label}</button>
    </li>
  );
});
