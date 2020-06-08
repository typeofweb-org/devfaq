import classNames from 'classnames';
import React from 'react';
import { TransitionGroup } from 'react-transition-group';

import { AppState } from '../../../redux/reducers/index';
import { Question } from '../../../redux/reducers/questions';
import { AnimateHeight } from '../../animateProperty/AnimateProperty';

import { QuestionItem } from './questionItem/QuestionItem';
import styles from './questionsList.module.scss';

type QuestionListProps = {
  selectable?: boolean;
  unselectable?: boolean;
  editable?: boolean;
  questions?: AppState['questions'];
  selectedQuestionIds?: Array<Question['id']>;
  toggleQuestion(questionId: Question['id']): any;
  editQuestion?(questionId: Question['id']): any;
  className?: string;
};

const QuestionsList = React.memo<QuestionListProps>(
  ({
    selectable = true,
    unselectable = false,
    editable = false,
    questions = {},
    selectedQuestionIds = [],
    className,
    toggleQuestion,
    editQuestion,
  }) => {
    if (!questions.data) {
      return null;
    }
    return (
      <TransitionGroup
        appear={false}
        enter={false}
        className={classNames(styles.appQuestionsList, className)}
        component="div"
      >
        {questions.data.data.map((question) => {
          const nodeRef = React.createRef<HTMLElement>();
          return (
            <AnimateHeight nodeRef={nodeRef} enterTime={700} exitTime={700} key={question.id}>
              <QuestionItem
                ref={nodeRef}
                question={question}
                selectable={selectable}
                editable={editable}
                unselectable={unselectable}
                selectedQuestionIds={selectedQuestionIds}
                toggleQuestion={toggleQuestion}
                editQuestion={editQuestion}
              />
            </AnimateHeight>
          );
        })}
      </TransitionGroup>
    );
  }
);

export default QuestionsList;
