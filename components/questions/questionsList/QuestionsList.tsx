import classNames from 'classnames';
import React from 'react';
import { TransitionGroup } from 'react-transition-group';

import { AppState } from '../../../redux/reducers/index';
import { Question } from '../../../redux/reducers/questions';
import { AnimateHeight } from '../../animateProperty/AnimateProperty';

import { QuestionItem } from './questionItem/QuestionItem';
import styles from './questionsList.module.scss';

const defaultProps = {
  selectable: true,
  unselectable: false,
  editable: false,
  questions: {} as AppState['questions'],
  selectedQuestionIds: [] as Array<Question['id']>,
};

export default class QuestionsList extends React.PureComponent<
  typeof defaultProps & {
    toggleQuestion(questionId: Question['id']): any;
    editQuestion?(questionId: Question['id']): any;
  } & { className?: string }
> {
  static defaultProps = defaultProps;

  render() {
    if (!this.props.questions.data) {
      return null;
    }
    return (
      <TransitionGroup
        appear={false}
        enter={false}
        className={classNames(styles.appQuestionsList, this.props.className)}
        component="div"
      >
        {this.props.questions.data.data.map((question) => {
          const nodeRef = React.createRef<HTMLElement>();
          return (
            <AnimateHeight nodeRef={nodeRef} enterTime={700} exitTime={700} key={question.id}>
              <QuestionItem
                ref={nodeRef}
                question={question}
                selectable={this.props.selectable}
                editable={this.props.editable}
                unselectable={this.props.unselectable}
                selectedQuestionIds={this.props.selectedQuestionIds}
                toggleQuestion={this.props.toggleQuestion}
                editQuestion={this.props.editQuestion}
              />
            </AnimateHeight>
          );
        })}
      </TransitionGroup>
    );
  }
}
