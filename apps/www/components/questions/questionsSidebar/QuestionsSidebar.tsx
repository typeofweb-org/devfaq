import classNames from 'classnames';
import React from 'react';

import { useUIContext } from '../../../contexts/UIContextProvider';

import LevelFilter from './levelFilter/LevelFilter';
import styles from './questionsSidebar.module.scss';
import { TechnologyFilter } from './technologyFilter/TechnologyFilter';

const QuestionsSidebar = () => {
  const { isSidebarOpen, closeSidebar } = useUIContext();

  return (
    <div className={styles.questionsSidebar}>
      <aside
        className={classNames('app-sidebar', styles.appSidebar, {
          [styles.open]: isSidebarOpen,
        })}
      >
        <section>
          <TechnologyFilter />
        </section>
        <section>
          <LevelFilter />
        </section>
        <button
          className={classNames(styles.appSidebarAccept, 'round-button branding-button-inverse')}
          onClick={closeSidebar}
        >
          Pokaż wyniki
        </button>
        <button className={styles.appSidebarClose} title="Zamknij" onClick={closeSidebar}>
          &times;
        </button>
      </aside>
    </div>
  );
};

export default QuestionsSidebar;
