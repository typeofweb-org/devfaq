import { connect } from 'react-redux';
import * as React from 'react';
import { AppState } from '../../../redux/reducers/index';
import {
  getAreAnyQuestionSelected,
  getSelectedQuestionsIds,
  getSelectedQuestionsWithCategories,
} from '../../../redux/selectors/selectors';
import QuestionsList from '../questionsList/QuestionsList';
import NoQuestionsSelectedInfo from './NoQuestionsSelectedInfo';
import './selectedQuestions.scss';
import { Question } from 'redux/reducers/questions';
import { TechnologyKey, technologyIconItems } from '../../../constants/technology-icon-items';
import { ActionCreators } from '../../../redux/actions';

class SelectedQuestionsComponent extends React.Component<
  ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps
> {
  render() {
    if (this.props.areAnyQuestionSelected) {
      return this.renderSelectedQuestionsList();
    } else {
      return <NoQuestionsSelectedInfo />;
    }
  }

  renderSelectedQuestionsList() {
    return this.props.selectedQuestionsWithCategories.map(([category, questions]) =>
      this.renderSelectedQuestionsCategory(category, questions)
    );
  }

  renderSelectedQuestionsCategory(category: TechnologyKey, questions: Question[]) {
    const icon = technologyIconItems.find((i) => i.name === category)!;

    return (
      <section key={category}>
        <div className="selected-questions-container">
          <div className="technology-icon-container">
            <span className="technology-icon-label">{icon.label}</span>
            <span className={icon.icon} />
          </div>
          <QuestionsList
            selectedQuestionIds={this.props.selectedQuestionIds}
            questions={{ isLoading: false, data: questions }}
            selectable={false}
            removable={true}
            toggleQuestion={this.toggleQuestion}
          />
        </div>
      </section>
    );
  }

  toggleQuestion = (questionId: Question['id']) => {
    this.props.deselectQuestion(questionId);
  };
}

const mapStateToProps = (state: AppState) => {
  return {
    selectedQuestionsWithCategories: getSelectedQuestionsWithCategories(state),
    selectedQuestionIds: getSelectedQuestionsIds(state),
    areAnyQuestionSelected: getAreAnyQuestionSelected(state),
  };
};

const mapDispatchToProps = { deselectQuestion: ActionCreators.deselectQuestion };

const SelectedQuestions = connect(mapStateToProps, mapDispatchToProps)(SelectedQuestionsComponent);
export default SelectedQuestions;
