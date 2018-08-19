import * as React from 'react';
import QuestionsSidebar from '../questions/questionsSidebar/QuestionsSidebar';
import QuestionsList from '../questions/questionsList/QuestionsList';
import { ActionCreators } from '../../redux/actions';
import { AppState } from '../../redux/reducers/index';
import { connect } from 'react-redux';
import { LevelKey } from '../../constants/level';
import { TechnologyKey } from '../../constants/technology-icon-items';
import { Question } from '../../redux/reducers/questions';

type AdminQuestionsProps = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;
type AdminQuestionsState = {
  status: 'pending' | 'accepted';
  selectedLevels: LevelKey[];
  technology?: TechnologyKey;
};

class AdminQuestions extends React.Component<AdminQuestionsProps, AdminQuestionsState> {
  state: AdminQuestionsState = {
    status: 'pending',
    selectedLevels: [],
  };

  componentDidMount() {
    const { technology, selectedLevels, status } = this.state;

    this.props.fetchQuestionsForAdmin({
      technology,
      selectedLevels,
      status,
    });
  }

  componentDidUpdate(_prevProps: AdminQuestionsProps, prevState: AdminQuestionsState) {
    if (prevState !== this.state) {
      const { technology, selectedLevels, status } = this.state;

      this.props.fetchQuestionsForAdmin({
        technology,
        selectedLevels,
        status,
      });
    }
  }

  toggleQuestion = (questionId: Question['id']) => {
    this.props.deleteQuestionForAdmin(questionId);
  };

  editQuestion = (questionId: Question['id']) => {
    console.log(questionId);
  };

  render() {
    return (
      <React.Fragment>
        <QuestionsSidebar />
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
  console.log(state.questions);
  return {
    questions: state.questions,
  };
};

const mapDispatchToProps = {
  fetchQuestionsForAdmin: ActionCreators.fetchQuestionsForAdmin,
  deleteQuestionForAdmin: ActionCreators.deleteQuestionForAdmin,
  uiOpenAddQuestionModal: ActionCreators.uiOpenAddQuestionModal,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AdminQuestions);
