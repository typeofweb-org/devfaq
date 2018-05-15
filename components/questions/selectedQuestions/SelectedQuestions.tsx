import { connect } from 'react-redux';
import * as React from 'react';
import { AppState } from '../../../redux/reducers/index';
import {
  areAnyQuestionSelected,
  getSelectedQuestionsIds,
} from '../../../redux/selectors/selectors';
import QuestionsList from '../questionsList/QuestionsList';
import NoQuestionsSelectedInfo from './NoQuestionsSelectedInfo';

class SelectedQuestionsComponent extends React.Component<ReturnType<typeof mapStateToProps>> {
  render() {
    if (this.props.areAnyQuestionSelected) {
      return (
        <QuestionsList
          selectedQuestionIds={this.props.selectedQuestionIds}
          questions={this.props.selectedQuestions}
          selectable={false}
          removable={false}
          editable={false}
          toggleQuestion={() => {}}
        />
      );
    } else {
      return <NoQuestionsSelectedInfo />;
    }
  }
}

const mapStateToProps = (state: AppState) => {
  return {
    selectedQuestions: state.selectedQuestions,
    selectedQuestionIds: getSelectedQuestionsIds(state),
    areAnyQuestionSelected: areAnyQuestionSelected(state),
  };
};

const SelectedQuestions = connect(mapStateToProps)(SelectedQuestionsComponent);
export default SelectedQuestions;
