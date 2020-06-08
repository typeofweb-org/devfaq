import classNames from 'classnames';
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { ActionCreators } from '../../../redux/actions';

import LevelFilter from './levelFilter/LevelFilter';
import styles from './questionsSidebar.module.scss';
import { TechnologyFilter } from './technologyFilter/TechnologyFilter';

const QuestionsSidebar = () => {
  const isSidebarOpen = useSelector((state) => state.ui.isSidebarOpen);
  const dispatch = useDispatch();

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
          onClick={() => dispatch(ActionCreators.uiCloseSidebar())}
        >
          Pokaż wyniki
        </button>
        <button
          className={styles.appSidebarClose}
          title="Zamknij"
          onClick={() => dispatch(ActionCreators.uiCloseSidebar())}
        >
          &times;
        </button>
      </aside>
    </div>
  );
};

export default QuestionsSidebar;
