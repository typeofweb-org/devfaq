import * as React from 'react';
import { Question } from '../../../redux/reducers/questions';
import './questionsList.scss';
import QuestionItem from './questionItem/QuestionItem';
import { TransitionGroup } from 'react-transition-group';
import { AnimateHeight } from '../../animateProperty/AnimateProperty';

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
      <TransitionGroup className="app-questions--list" component="div">
        {this.props.questions.map((question) => (
          <AnimateHeight time={700} key={question.id}>
            <QuestionItem
              key={question.id}
              question={question}
              selectable={this.props.selectable}
              removable={this.props.removable}
              selectedQuestionIds={this.props.selectedQuestionIds}
              toggleQuestion={this.props.toggleQuestion}
            />
          </AnimateHeight>
        ))}
      </TransitionGroup>
    );
  }
}
