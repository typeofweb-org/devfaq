import * as React from 'react';
import { Question } from '../../../redux/reducers/questions';
import './questionsList.scss';
import QuestionItem from './questionItem/QuestionItem';

const defaultProps = {
  selectable: true,
  removable: false,
  questions: [] as Question[],
  selectedQuestionIds: [] as Question['id'][],
};

export default class QuestionsList extends React.Component<
  typeof defaultProps & { toggleQuestion(questionId: Question['id']): any }
> {
  static defaultProps = defaultProps;

  render() {
    return (
      <div className="app-questions--list">
        {this.props.questions.map((question) => (
          <QuestionItem
            key={question.id}
            question={question}
            selectable={this.props.selectable}
            removable={this.props.removable}
            selectedQuestionIds={this.props.selectedQuestionIds}
            toggleQuestion={this.props.toggleQuestion}
          />
        ))}
      </div>
    );
  }
}
