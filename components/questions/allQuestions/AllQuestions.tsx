import React from 'react';
import { AppState } from '../../../redux/reducers/index';
import { connect } from 'react-redux';
import { technologyIconItems, Technology } from '../../../constants/technology-icon-items';
import styles from './allQuestions.module.scss';
import { AllQuestionsHeader } from './allQuestionsHeader/AllQuestionsHeader';
import { AllQuestionsFooter } from './allQuestionsFooter/AllQuestionsFooter';
import QuestionsList from '../questionsList/QuestionsList';
import { Question } from '../../../redux/reducers/questions';
import {
  getSelectedQuestionsIds,
  getTechnology,
  getSortBy,
} from '../../../redux/selectors/selectors';
import { ActionCreators } from '../../../redux/actions';
import { isQuestionSelected } from '../questionsUtils';
import { Level } from '../../../constants/level';
import QuestionsPagination from '../../questionsPagination/QuestionsPagination';
import { redirect } from '../../../utils/redirect';

type AllQuestionsComponentProps = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

class AllQuestionsComponent extends React.Component<AllQuestionsComponentProps> {
  render() {
    const { technology, sortBy } = this.props;

    const technologyIconItem = technologyIconItems.find((t) => t.name === technology);
    const category = (technologyIconItem && technologyIconItem.label) || '';

    const length =
      this.props.questions.data &&
      this.props.questions.data.meta &&
      this.props.questions.data.meta.total;

    return (
      <section className={styles.appQuestions}>
        {this.props.questions.data && technology && (
          <AllQuestionsHeader
            category={category}
            questionsLength={length}
            onSortByChange={this.changeSortBy}
            sortBy={sortBy || 'acceptedAt*desc'}
          />
        )}
        {this.renderList()}
        {this.props.questions.data && technology && (
          <AllQuestionsFooter onAddNewClick={this.onAddNewClick} />
        )}
        <QuestionsPagination />
      </section>
    );
  }

  changeSortBy: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    const query = {
      ...this.props.route.query,
      sortBy: e.currentTarget.value,
    };
    redirect('/questions/[technology]', query);
  };

  renderList = () => {
    if (this.props.questions.error) {
      return (
        <div>
          <div>{this.props.questions.error.name}</div>
          <div>{this.props.questions.error.message}</div>
          <div>{this.props.questions.error.stack}</div>
        </div>
      );
    }
    if (!this.props.questions.data || this.props.questions.data.data.length === 0) {
      return null; // @todo handle errors and loading
    }

    return (
      <QuestionsList
        selectable={true}
        unselectable={false}
        questions={this.props.questions}
        selectedQuestionIds={this.props.selectedQuestionsIds}
        toggleQuestion={this.toggleQuestion}
      />
    );
  };

  onAddNewClick = () => {
    this.reportEvent('CTA Dodaj nowe pytanie');
    this.props.uiOpenAddQuestionModal();
  };

  reportEvent(action: string, label?: string, questionId?: number) {
    globalReportEvent(action, 'Lista pytań', label, questionId);
  }

  toggleQuestion = (questionId: Question['id']) => {
    const isSelected = isQuestionSelected(this.props.selectedQuestionsIds, questionId);
    const question =
      this.props.questions.data && this.props.questions.data.data.find((q) => q.id === questionId);

    if (isSelected) {
      this.props.deselectQuestion(questionId);
    } else {
      if (question) {
        this.props.selectQuestion(question);
      }
    }

    if (!question) {
      return;
    }

    const action = isSelected ? 'Checkbox - odznaczone pytanie' : 'Checkbox - zaznaczone pytanie';
    this.reportEvent(
      action,
      `${Technology[question._categoryId]}, ${Level[question._levelId]}`,
      question.id
    );
  };
}

const mapStateToProps = (state: AppState) => {
  return {
    technology: getTechnology(state),
    questions: state.questions,
    selectedQuestionsIds: getSelectedQuestionsIds(state),
    sortBy: getSortBy(state),
    route: state.routeDetails.current,
  };
};

const mapDispatchToProps = {
  selectQuestion: ActionCreators.selectQuestion,
  deselectQuestion: ActionCreators.deselectQuestion,
  uiOpenAddQuestionModal: ActionCreators.uiOpenAddQuestionModal,
};

const AllQuestions = connect(mapStateToProps, mapDispatchToProps)(AllQuestionsComponent);
export default AllQuestions;
