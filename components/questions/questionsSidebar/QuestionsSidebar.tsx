import classNames from 'classnames';
import React from 'react';
import { connect } from 'react-redux';

import { ActionCreators } from '../../../redux/actions';
import { AppState } from '../../../redux/reducers/index';

import LevelFilter from './levelFilter/LevelFilter';
import styles from './questionsSidebar.module.scss';
import { TechnologyFilter } from './technologyFilter/TechnologyFilter';

class QuestionsSidebarComponent extends React.Component<
  ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps
> {
  render() {
    return (
      <div className={styles.questionsSidebar}>
        <aside
          className={classNames('app-sidebar', styles.appSidebar, {
            [styles.open]: this.props.isSidebarOpen,
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
            onClick={this.props.uiCloseSidebar}
          >
            Pokaż wyniki
          </button>
          <button
            className={styles.appSidebarClose}
            title="Zamknij"
            onClick={this.props.uiCloseSidebar}
          >
            &times;
          </button>
        </aside>
      </div>
    );
  }
}

const mapStateToProps = (state: AppState) => {
  return {
    isSidebarOpen: state.ui.isSidebarOpen,
  };
};

const mapDispatchToProps = {
  uiOpenSidebar: ActionCreators.uiOpenSidebar,
  uiCloseSidebar: ActionCreators.uiCloseSidebar,
};

const QuestionsSidebar = connect(mapStateToProps, mapDispatchToProps)(QuestionsSidebarComponent);

export default QuestionsSidebar;
