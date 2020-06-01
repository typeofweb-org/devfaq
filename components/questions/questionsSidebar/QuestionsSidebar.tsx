import React from 'react';
import styles from './questionsSidebar.module.scss';
import classNames from 'classnames';
import { AppState } from '../../../redux/reducers/index';
import { ActionCreators } from '../../../redux/actions';
import { connect } from 'react-redux';
import { TechnologyFilter } from './technologyFilter/TechnologyFilter';
import LevelFilter from './levelFilter/LevelFilter';

class QuestionsSidebarComponent extends React.Component<
  ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps
> {
  render() {
    return (
      <div className={styles.questionsSidebar}>
        <aside
          className={classNames(styles.appSidebar, { [styles.open]: this.props.isSidebarOpen })}
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
