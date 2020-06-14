import classNames from 'classnames';
import React, { memo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { ActionCreators } from '../../../redux/actions';

import { LevelFilter } from './levelFilter/LevelFilter';
import styles from './questionsSidebar.module.scss';
import { TechnologyFilter } from './technologyFilter/TechnologyFilter';

export const QuestionsSidebar = memo(() => {
  const isSidebarOpen = useSelector((state) => state.ui.isSidebarOpen);
  const dispatch = useDispatch();

  const close = useCallback(() => dispatch(ActionCreators.uiCloseSidebar()), [dispatch]);

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
          onClick={close}
        >
          Pokaż wyniki
        </button>
        <button className={styles.appSidebarClose} title="Zamknij" onClick={close}>
          &times;
        </button>
      </aside>
    </div>
  );
});
