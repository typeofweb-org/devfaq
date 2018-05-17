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

class SelectedQuestionsComponent extends React.Component<ReturnType<typeof mapStateToProps>> {
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
            questions={questions}
            selectable={false}
            removable={true}
            toggleQuestion={() => {}}
          />
        </div>
      </section>
    );
  }
}

const mapStateToProps = (state: AppState) => {
  return {
    selectedQuestionsWithCategories: getSelectedQuestionsWithCategories(state),
    selectedQuestionIds: getSelectedQuestionsIds(state),
    areAnyQuestionSelected: getAreAnyQuestionSelected(state),
  };
};

const SelectedQuestions = connect(mapStateToProps)(SelectedQuestionsComponent);
export default SelectedQuestions;
