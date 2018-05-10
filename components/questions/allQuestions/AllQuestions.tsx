import * as React from 'react';
import { AppState } from '../../../redux/reducers/index';
import { connect } from 'react-redux';
import { withRouter, SingletonRouter } from 'next/router';
import { technologyIconItems } from '../../../constants/technology-icon-items';
import './allQuestions.scss';
import { AllQuestionsHeader } from './allQuestionsHeader/AllQuestionsHeader';
import { AllQuestionsFooter } from './allQuestionsFooter/AllQuestionsFooter';
import QuestionsList from '../questionsList/QuestionsList';

type RouterProps = { router: SingletonRouter };

class AllQuestionsComponent extends React.Component<
  ReturnType<typeof mapStateToProps> & RouterProps
> {
  render() {
    const technology = this.props.router.query && this.props.router.query['technology'];
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
}

const mapStateToProps = (state: AppState) => {
  return {
    questions: state.questions,
  };
};

const AllQuestions = connect(mapStateToProps)(withRouter(AllQuestionsComponent));
export default AllQuestions;
