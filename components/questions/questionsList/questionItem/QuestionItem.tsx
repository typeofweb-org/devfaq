import './questionItem.scss';
import * as React from 'react';
import { Question } from '../../../../redux/reducers/questions';
import * as classNames from 'classnames';
import { pl } from 'date-fns/locale';
import { formatWithOptions } from 'date-fns/fp';
import { isQuestionSelected } from '../../questionsUtils';
import MarkdownText from '../../../markdownText/MarkdownText';
import { AnimateHeight } from '../../../animateProperty/AnimateProperty';

const longDate = formatWithOptions({ locale: pl }, 'LL');
const shortDate = formatWithOptions({ locale: pl }, 'L');

type QuestionItemOwnProps = {
  question: Question;
  selectable: boolean;
  removable: boolean;
  selectedQuestionIds: number[];
  toggleQuestion(questionId: Question['id']): any;
};

type QuestionItemState = {
  questionRemovalTimer?: NodeJS.Timer;
  isQuestionBeingRemoved: boolean;
};

const QUESTION_DELETION_DELAY = 5000;

type QuestionContentProps = {
  selectable: boolean;
  removable: boolean;
  isSelected: boolean;
  isQuestionBeingRemoved: boolean;
  question: Question;
  toggleQuestion(): any;
  deleteQuestion(): any;
};

class QuestionContent extends React.Component<QuestionContentProps> {
  render() {
    const { question, isSelected } = this.props;

    return (
      <div
        className={classNames('app-questions--question', {
          active: isSelected,
        })}
      >
        {this.maybeRenderCheckbox()}

        <MarkdownText className="app-questions--question--text" value={question.question} />

        {this.renderMeta()}
        {this.maybeRenderDeleteButton()}
      </div>
    );
  }

  maybeRenderCheckbox() {
    if (!this.props.selectable) {
      return null;
    }

    return (
      <input
        onChange={this.props.toggleQuestion}
        checked={this.props.isSelected}
        type="checkbox"
        className="app-questions--question--checkbox"
      />
    );
  }

  renderMeta() {
    const { question } = this.props;

    return (
      <div className="app-questions--question--meta">
        <span className={classNames('app-questions--question--tag', `app-questions--question--tag_${question.level}`)}>
          {question.level}
        </span>
        <time
          dateTime={question.acceptedAt}
          className="app-questions--question--date app-questions--question--date_long"
        >
          {longDate(question.acceptedAt)}
        </time>
        <time
          dateTime={question.acceptedAt}
          className="app-questions--question--date app-questions--question--date_short"
        >
          {shortDate(question.acceptedAt)}
        </time>
      </div>
    );
  }

  maybeRenderDeleteButton() {
    if (!this.props.removable) {
      return null;
    }

    return (
      <div className="app-questions--question--remove-container">
        <button className="app-questions--question--remove--icon" onClick={this.props.deleteQuestion} />
      </div>
    );
  }
}

export default class QuestionItem extends React.Component<QuestionItemOwnProps, QuestionItemState> {
  state: QuestionItemState = {
    isQuestionBeingRemoved: false,
  };

  componentWillUnmount() {
    if (this.state.isQuestionBeingRemoved) {
      this.stopDeletionTimer();
      this.props.toggleQuestion(this.props.question.id);
    }
  }

  render() {
    const { question, selectable, removable } = this.props;
    const { isQuestionBeingRemoved } = this.state;
    const isSelected = this.isCurrentQuestionSelected();

    return (
      <article key={question.id}>
        {this.maybeRenderDeleteProgress()}
        <AnimateHeight isIn={!isQuestionBeingRemoved} time={500}>
          <QuestionContent
            selectable={selectable}
            removable={removable}
            isSelected={isSelected}
            isQuestionBeingRemoved={isQuestionBeingRemoved}
            question={question}
            toggleQuestion={this.toggleQuestion}
            deleteQuestion={this.deleteQuestion}
          />
        </AnimateHeight>
      </article>
    );
  }

  maybeRenderDeleteProgress() {
    if (!this.props.removable) {
      return null;
    }

    return (
      <div
        className={classNames('app-questions--question', 'app-questions--question_deleted', {
          'being-removed': this.state.isQuestionBeingRemoved,
        })}
        onMouseOver={this.stopDeletionTimer}
        onMouseLeave={this.startDeletionTimer}
      >
        <div className="action-icon action-icon_warning icon-small" />
        <p>Usunąłeś pytanie ze swojej listy!</p>
        <button className="round-button branding-button-inverse" onClick={this.undoDeleteQuestion}>
          Cofnij
        </button>
        {this.state.questionRemovalTimer && <div className="app-questions--question_deleted--progress" />}
      </div>
    );
  }

  toggleQuestion = () => {
    this.props.toggleQuestion(this.props.question.id);
  };

  deleteQuestion = () => {
    this.setState({ isQuestionBeingRemoved: true }, () => {
      this.startDeletionTimer();
    });
  };

  undoDeleteQuestion = () => {
    this.setState({ isQuestionBeingRemoved: false }, () => {
      this.stopDeletionTimer();
    });
  };

  startDeletionTimer = () => {
    const { question } = this.props;

    if (!this.state.isQuestionBeingRemoved) {
      return;
    }
    if (this.state.questionRemovalTimer) {
      return;
    }

    const questionRemovalTimer = setTimeout(() => {
      console.log(question.id);
      this.props.toggleQuestion(question.id);
    }, QUESTION_DELETION_DELAY);

    this.setState({
      questionRemovalTimer,
    });
  };

  stopDeletionTimer = () => {
    if (!this.state.isQuestionBeingRemoved) {
      return;
    }
    if (!this.state.questionRemovalTimer) {
      return;
    }

    clearTimeout(this.state.questionRemovalTimer);
    this.setState({
      questionRemovalTimer: undefined,
    });
  };

  isCurrentQuestionSelected = () => {
    return isQuestionSelected(this.props.selectedQuestionIds, this.props.question.id);
  };
}
