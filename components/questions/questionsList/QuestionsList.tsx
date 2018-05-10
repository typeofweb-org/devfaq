import * as React from 'react';
import { Question } from '../../../redux/reducers/questions';
import './questionsList.scss';
import QuestionItem from './questionItem/QuestionItem';

const defaultProps = {
  selectable: true,
  removable: false,
  editable: false,
  questions: [] as Question[],
  selectedQuestionIds: [] as number[],
};

export default class QuestionsList extends React.Component<typeof defaultProps> {
  static defaultProps = defaultProps;

  render() {
    return (
      <div className="app-questions--list">
        {this.props.questions.map((question) => (
          <QuestionItem
            key={question.id}
            question={question}
            selectable={this.props.selectable}
            editable={this.props.editable}
            removable={this.props.removable}
            selectedQuestionIds={this.props.selectedQuestionIds}
            toggleQuestion={console.log}
          />
        ))}
      </div>
    );
  }
}
