import { connect } from 'react-redux';
import * as React from 'react';
import AddQuestionModal from '../addQuestionModal/AddQuestionModal';
import { AppState } from '../../../redux/reducers/index';
import { ActionCreators } from '../../../redux/actions';
import { CSSTransition } from 'react-transition-group';
import AddQuestionConfirmationModal from '../addQuestionConfirmationModal/AddQuestionConfirmationModal';

class AppModalsComponent extends React.Component<ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps> {
  render() {
    return (
      <React.Fragment>
        <CSSTransition
          in={this.props.isAddQuestionModalOpen}
          unmountOnExit={true}
          mountOnEnter={true}
          classNames="fade"
          timeout={200}
        >
          <AddQuestionModal onClose={this.props.uiCloseAddQuestionModal} />
        </CSSTransition>

        <CSSTransition
          in={this.props.isAddQuestionConfirmationModalOpen}
          unmountOnExit={true}
          mountOnEnter={true}
          classNames="fade"
          timeout={200}
        >
          <AddQuestionConfirmationModal onClose={this.props.uiCloseAddQuestionConfirmationModal} />
        </CSSTransition>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state: AppState) => {
  return {
    isAddQuestionModalOpen: state.ui.isAddQuestionModalOpen,
    isAddQuestionConfirmationModalOpen: state.ui.isAddQuestionConfirmationModalOpen,
  };
};
const mapDispatchToProps = {
  uiCloseAddQuestionModal: ActionCreators.uiCloseAddQuestionModal,
  uiCloseAddQuestionConfirmationModal: ActionCreators.uiCloseAddQuestionConfirmationModal,
};

const AppModals = connect(mapStateToProps, mapDispatchToProps)(AppModalsComponent);
export default AppModals;
