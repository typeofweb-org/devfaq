import * as React from 'react';
import { AppState } from '../../../redux/reducers/index';
import { connect } from 'react-redux';
import { technologyIconItems, TechnologyKey } from '../../../constants/technology-icon-items';
import './allQuestions.scss';
import { AllQuestionsHeader } from './allQuestionsHeader/AllQuestionsHeader';
import { AllQuestionsFooter } from './allQuestionsFooter/AllQuestionsFooter';
import QuestionsList from '../questionsList/QuestionsList';

type AllQuestionsComponentProps = ReturnType<typeof mapStateToProps>;
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
          questions={[
            {
              id: 1,
              question: 'something something bla bla',
              category: 'js',
              status: 'accepted',
              level: 'junior',
              acceptedAt: '2018-01-01',
            },
          ]}
          selectedQuestionIds={[]}
        />
        <AllQuestionsFooter onAddNewClick={() => {}} />
      </section>
    );
  }

  onRouteChangeComplete = () => {
    const nextState = AllQuestionsComponent.getDerivedStateFromProps(this.props, this.state);
    this.setState(nextState as Required<AllQuestionsComponentState>);
  };
}

const mapStateToProps = (state: AppState) => {
  return {
    routeDetails: state.routeDetails,
    questions: state.questions,
  };
};

const AllQuestions = connect(mapStateToProps)(AllQuestionsComponent);
export default AllQuestions;
