import { connect } from 'react-redux';
import * as React from 'react';
import AddQuestionModal from '../addQuestionModal/AddQuestionModal';
import { AppState } from '../../../redux/reducers/index';
import { ActionCreators } from '../../../redux/actions';
import { CSSTransition } from 'react-transition-group';
import AddQuestionConfirmationModal from '../addQuestionConfirmationModal/AddQuestionConfirmationModal';
import { CommonModalProps } from '../baseModal/BaseModal';

const timeout = 200;

class AppModalsComponent extends React.Component<
  ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps
> {
  closeQuestionModal: CommonModalProps['onClose'] = args => {
    if (this.props.addQuestionModalState.onClose) {
      this.props.addQuestionModalState.onClose(args);
    }
    if (this.props.addQuestionModalState.data) {
      this.props.uiCloseEditQuestionModal();
    } else {
      this.props.uiCloseAddQuestionModal();
    }
  };

  render() {
    return (
      <React.Fragment>
        <CSSTransition
          in={this.props.addQuestionModalState.open}
          unmountOnExit={true}
          mountOnEnter={true}
          classNames="fade"
          timeout={timeout}
        >
          <AddQuestionModal
            originalQuestion={this.props.addQuestionModalState.data}
            onClose={this.closeQuestionModal}
          />
        </CSSTransition>

        <CSSTransition
          in={this.props.isAddQuestionConfirmationModalOpen}
          unmountOnExit={true}
          mountOnEnter={true}
          classNames="fade"
          timeout={timeout}
        >
          <AddQuestionConfirmationModal onClose={this.props.uiCloseAddQuestionConfirmationModal} />
        </CSSTransition>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state: AppState) => {
  return {
    addQuestionModalState: state.ui.addQuestionModal,
    isAddQuestionConfirmationModalOpen: state.ui.isAddQuestionConfirmationModalOpen,
  };
};

const mapDispatchToProps = {
  uiCloseAddQuestionModal: ActionCreators.uiCloseAddQuestionModal,
  uiCloseEditQuestionModal: ActionCreators.uiCloseEditQuestionModal,
  uiCloseAddQuestionConfirmationModal: ActionCreators.uiCloseAddQuestionConfirmationModal,
};

const AppModals = connect(
  mapStateToProps,
  mapDispatchToProps
)(AppModalsComponent);
export default AppModals;
