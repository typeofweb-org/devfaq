import * as React from 'react';
import { AppState } from '../../../redux/reducers/index';
import { connect } from 'react-redux';
import { technologyIconItems, TechnologyKey } from '../../../constants/technology-icon-items';
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
    const technologyIconItem = technologyIconItems.find((t) => t.name === technology);
    const category = (technologyIconItem && technologyIconItem.label) || '';

    if (!this.props.questions.data) {
      return null; // @todo handle errors and loading
    }

    return (
      <section className="app-questions">
        <AllQuestionsHeader
          category={category}
          questionsLength={this.props.questions.data.length}
        />
        <QuestionsList
          selectable={true}
          removable={false}
          editable={false}
          questions={this.props.questions.data}
          selectedQuestionIds={this.props.selectedQuestionsIds}
          toggleQuestion={this.toggleQuestion}
        />
        <AllQuestionsFooter onAddNewClick={() => {}} />
      </section>
    );
  }

  toggleQuestion = (question: Question) => {
    if (isQuestionSelected(this.props.selectedQuestionsIds, question)) {
      this.props.deselectQuestion(question);
    } else {
      this.props.selectQuestion(question);
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
