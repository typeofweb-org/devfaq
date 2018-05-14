import * as React from 'react';
import { AppState } from '../../../redux/reducers/index';
import { connect } from 'react-redux';
import { technologyIconItems, TechnologyKey } from '../../../constants/technology-icon-items';
import './allQuestions.scss';
import { AllQuestionsHeader } from './allQuestionsHeader/AllQuestionsHeader';
import { AllQuestionsFooter } from './allQuestionsFooter/AllQuestionsFooter';
import QuestionsList from '../questionsList/QuestionsList';
import { Question } from '../../../redux/reducers/questions';
import { getSelectedQuestionsIds } from '../../../redux/selectors/selectors';
import { ActionCreators } from '../../../redux/actions';
import { isQuestionSelected } from '../questionsUtils';
import { routeDetails } from '../../../redux/reducers/routeDetails';

type AllQuestionsComponentProps = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;
type AllQuestionsComponentState = {
  technology: TechnologyKey | undefined;
};

class AllQuestionsComponent extends React.Component<
  AllQuestionsComponentProps,
  AllQuestionsComponentState
> {
  state = {
    technology: undefined,
  };

  static getDerivedStateFromProps(
    nextProps: AllQuestionsComponentProps,
    _prevState: AllQuestionsComponentState
  ): Partial<AllQuestionsComponentState> {
    return {
      technology:
        nextProps.routeDetails.query &&
        (nextProps.routeDetails.query['technology'] as TechnologyKey),
    };
  }

  componentDidUpdate(
    _prevProps: AllQuestionsComponentProps,
    prevState: AllQuestionsComponentState
  ) {
    if (prevState.technology === this.state.technology) {
      return;
    }

    this.fetchProductsForTechnology(this.state.technology);
  }

  fetchProductsForTechnology = (technology: TechnologyKey | undefined) => {
    if (!this.state.technology) {
      return;
    }
    console.log('Fetching…', technology);
  };

  render() {
    const { technology } = this.state;
    const technologyIconItem = technologyIconItems.find((t) => t.name === technology);
    const category = (technologyIconItem && technologyIconItem.label) || '';
    return (
      <section className="app-questions">
        <AllQuestionsHeader category={category} questionsLength={this.props.questions.length} />
        <QuestionsList
          selectable={true}
          removable={false}
          editable={false}
          questions={this.props.questions}
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

  onRouteChangeComplete = () => {
    const nextState = AllQuestionsComponent.getDerivedStateFromProps(this.props, this.state);
    this.setState(nextState as Required<AllQuestionsComponentState>);
  };
}

const mapStateToProps = (state: AppState) => {
  return {
    routeDetails: state.routeDetails,
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
