import * as React from 'react';
import { AppState } from '../../../redux/reducers/index';
import { connect } from 'react-redux';
import { technologyIconItems } from '../../../constants/technology-icon-items';
import './allQuestions.scss';
import { AllQuestionsHeader } from './allQuestionsHeader/AllQuestionsHeader';
import { AllQuestionsFooter } from './allQuestionsFooter/AllQuestionsFooter';
import QuestionsList from '../questionsList/QuestionsList';
import { Question } from '../../../redux/reducers/questions';
import { getSelectedQuestionsIds, getTechnology } from '../../../redux/selectors/selectors';
import { ActionCreators } from '../../../redux/actions';
import { isQuestionSelected } from '../questionsUtils';

type AllQuestionsComponentProps = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

class AllQuestionsComponent extends React.Component<AllQuestionsComponentProps> {
  render() {
    const { technology } = this.props;

    if (!this.props.questions.data || this.props.questions.data.length === 0) {
      return null; // @todo handle errors and loading
    }

    if (!technology) {
      return null;
    }

    const technologyIconItem = technologyIconItems.find((t) => t.name === technology);
    const category = (technologyIconItem && technologyIconItem.label) || '';

    return (
      <section className="app-questions">
        <AllQuestionsHeader category={category} questionsLength={this.props.questions.data.length} />
        <QuestionsList
          selectable={true}
          removable={false}
          questions={this.props.questions}
          selectedQuestionIds={this.props.selectedQuestionsIds}
          toggleQuestion={this.toggleQuestion}
        />
        <AllQuestionsFooter onAddNewClick={() => {}} />
      </section>
    );
  }

  toggleQuestion = (questionId: Question['id']) => {
    if (isQuestionSelected(this.props.selectedQuestionsIds, questionId)) {
      this.props.deselectQuestion(questionId);
    } else {
      const question = this.props.questions.data && this.props.questions.data.find((q) => q.id === questionId);
      if (question) {
        this.props.selectQuestion(question);
      }
    }
  };
}

const mapStateToProps = (state: AppState) => {
  return {
    technology: getTechnology(state),
    questions: state.questions,
    selectedQuestionsIds: getSelectedQuestionsIds(state),
  };
};

const mapDispatchToProps = {
  selectQuestion: ActionCreators.selectQuestion,
  deselectQuestion: ActionCreators.deselectQuestion,
};

const AllQuestions = connect(mapStateToProps, mapDispatchToProps)(AllQuestionsComponent);
export default AllQuestions;
