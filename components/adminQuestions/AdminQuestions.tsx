import React from 'react';
import QuestionsList from '../questions/questionsList/QuestionsList';
import { ActionCreators } from '../../redux/actions';
import { AppState } from '../../redux/reducers/index';
import { connect } from 'react-redux';
import { TechnologyKey } from '../../constants/technology-icon-items';
import { Question } from '../../redux/reducers/questions';
import { CommonModalProps } from '../modals/baseModal/BaseModal';
import questionListStyles from '../questions/questionsList/questionsList.module.scss';
import noQuestionsStyles from '../questions/selectedQuestions/noQuestionsSelectedInfo.module.scss';
import spinnerStyles from '../../components/layout/appSpinner.module.scss';
import classNames from 'classnames';

type AdminQuestionsProps = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;
type AdminQuestionsState = {
  status: 'pending' | 'accepted';
  technology?: TechnologyKey;
};

class AdminQuestions extends React.Component<AdminQuestionsProps, AdminQuestionsState> {
  state: AdminQuestionsState = {
    status: 'pending',
  };

  componentDidMount() {
    this.refetchQuestions();
  }

  componentDidUpdate(prevProps: AdminQuestionsProps, prevState: AdminQuestionsState) {
    if (prevState !== this.state || this.props.selectedLevels !== prevProps.selectedLevels) {
      this.refetchQuestions();
    }
  }

  refetchQuestions = () => {
    const { technology, status } = this.state;
    const { selectedLevels } = this.props;

    this.props.fetchQuestionsForAdmin({
      technology,
      selectedLevels,
      status,
    });
  };

  toggleQuestion = (questionId: Question['id']) => {
    this.props.deleteQuestionForAdmin(questionId);
  };

  editQuestion = (questionId: Question['id']) => {
    if (!this.props.questions.data) {
      return;
    }

    const question = this.props.questions.data.data.find((q) => q.id === questionId);
    if (!question) {
      return;
    }

    this.props.uiOpenEditQuestionModal(question, this.onEditFinished);
  };

  onEditFinished: CommonModalProps['onClose'] = (e) => {
    if (e.reason && e.reason === 'submit') {
      this.refetchQuestions();
    }
  };

  maybeRenderEmptyMessage = () => {
    if (!this.props.questions.data || this.props.questions.data.data.length > 0) {
      return null;
    }
    return (
      <div className={questionListStyles.appQuestionsList} style={{ flex: 1 }}>
        <div className={classNames(noQuestionsStyles, 'container')}>
          <p>Nie zadnych pytań do zaakceptowania!</p>
        </div>
      </div>
    );
  };

  updateStatus: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    this.setState({ status: e.currentTarget.value as 'pending' | 'accepted' });
  };

  render() {
    if (!this.props.questions || this.props.questions.isLoading) {
      return null;
    }

    return (
      <React.Fragment>
        <label>
          {' '}
          Status:
          <select onChange={this.updateStatus} value={this.state.status}>
            <option value="pending">pending</option>
            <option value="accepted">accepted</option>
          </select>
        </label>
        {this.props.questions.isLoading && <div className={spinnerStyles.spinner} />}
        {this.maybeRenderEmptyMessage()}
        <QuestionsList
          selectable={false}
          unselectable={false}
          editable={true}
          questions={this.props.questions}
          selectedQuestionIds={[]}
          toggleQuestion={this.toggleQuestion}
          editQuestion={this.editQuestion}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state: AppState) => {
  return {
    questions: state.questions,
    selectedLevels: state.selectedLevels,
  };
};

const mapDispatchToProps = {
  fetchQuestionsForAdmin: ActionCreators.fetchQuestionsForAdmin,
  deleteQuestionForAdmin: ActionCreators.deleteQuestionForAdmin,
  uiOpenEditQuestionModal: ActionCreators.uiOpenEditQuestionModal,
};

export default connect(mapStateToProps, mapDispatchToProps)(AdminQuestions);
