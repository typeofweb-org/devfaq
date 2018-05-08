import * as React from 'react';
import './questionsSidebar.scss';
import * as classNames from 'classnames';
import { AppState } from '../../../redux/reducers/index';
import { ActionCreators } from '../../../redux/actions';
import { connect } from 'react-redux';
import { TechnologyFilter } from './technologyFilter/TechnologyFilter';

class QuestionsSidebarComponent extends React.Component<
  ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps
> {
  render() {
    return (
      <div className="questions-sidebar">
        <aside className={classNames('app-sidebar', { open: this.props.isSidebarOpen })}>
          <section className="app-sidebar--section">
            <TechnologyFilter />
          </section>
          <section className="app-sidebar--section">app-level-filter</section>
          <button
            className="app-sidebar--accept round-button branding-button-inverse"
            onClick={this.props.uiCloseSidebar}
          >
            Pokaż wyniki
          </button>
          <button
            className="app-sidebar--close"
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
