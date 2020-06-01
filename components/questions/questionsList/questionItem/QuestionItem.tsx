import styles from './questionItem.module.scss';
import React from 'react';
import classNames from 'classnames';
import dynamic from 'next/dynamic';

import { Question } from '../../../../redux/reducers/questions';
import { isQuestionSelected } from '../../questionsUtils';
import { AnimateHeight } from '../../../animateProperty/AnimateProperty';
import { isEqual } from 'lodash';
import ActiveLink from '../../../activeLink/ActiveLink';
import QuestionVoting from './QuestionVoting';

const MarkdownText = dynamic(() => import('../../../markdownText/MarkdownText'));

const longDate = (dateStr?: string) => {
  if (!dateStr) {
    return '';
  }
  const date = new Date(dateStr);
  const months = [
    'stycznia',
    'lutego',
    'marca',
    'kwietnia',
    'maja',
    'czerwca',
    'lipca',
    'sierpnia',
    'września',
    'października',
    'listopada',
    'grudnia',
  ];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};
const shortDate = (dateStr?: string) => {
  if (!dateStr) {
    return '';
  }
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
};

interface QuestionItemOwnProps {
  question: Question;
  selectable: boolean;
  editable: boolean;
  unselectable: boolean;
  selectedQuestionIds: number[];
  toggleQuestion(questionId: Question['id']): any;
  editQuestion?(questionId: Question['id']): any;
}

interface QuestionItemState {
  questionRemovalTimer?: NodeJS.Timer;
  isQuestionBeingRemoved: boolean;
}

const QUESTION_DELETION_DELAY = 5000;

interface QuestionContentProps {
  selectable: boolean;
  unselectable: boolean;
  editable: boolean;
  isSelected: boolean;
  isQuestionBeingRemoved: boolean;
  question: Question;
  toggleQuestion(): any;
  deleteQuestion(): any;
  editQuestion(): any;
}

class QuestionContent extends React.PureComponent<QuestionContentProps> {
  render() {
    const { question, isSelected } = this.props;

    return (
      <div
        className={classNames(styles.appQuestionsQuestion, {
          [styles.active]: isSelected,
        })}
      >
        <div className={styles.appQuestionsContentContainer}>
          {this.maybeRenderCheckbox()}
          {this.maybeRenderAdminButtons()}

          <div className={styles.appQuestionsQuestionText} itemProp="text">
            <MarkdownText value={question.question} />
          </div>

          {this.renderMeta()}
          {this.maybeRenderDeleteButton()}
        </div>
        {this.maybeRenderVoting()}
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
        className={styles.appQuestionsQuestionCheckbox}
      />
    );
  }

  renderMeta() {
    const { question } = this.props;
    const keywords = [question._levelId, question._categoryId].join(', ');
    const className = `tag_${question._levelId}` as 'tag_junior' | 'tag_mid' | 'tag_senior';

    return (
      <div className={styles.appQuestionsQuestionMeta}>
        <span className={classNames(styles.tag, styles[className])}>{question._levelId}</span>
        <meta itemProp="dateCreated" content={question.acceptedAt} />
        <meta itemProp="keywords" content={keywords} />
        <time
          dateTime={question.acceptedAt}
          className={classNames(
            styles.appQuestionsQuestionDate,
            styles.appQuestionsQuestionDateLong
          )}
        >
          <ActiveLink
            href="/questions/p/[id]"
            query={{ id: String(question.id) }}
            activeClassName=""
          >
            <a>{longDate(question.acceptedAt)}</a>
          </ActiveLink>
        </time>
        <time
          dateTime={question.acceptedAt}
          className={classNames(
            styles.appQuestionsQuestionDate,
            styles.appQuestionsQuestionDateShort
          )}
        >
          {shortDate(question.acceptedAt)}
        </time>
      </div>
    );
  }

  maybeRenderVoting() {
    if (this.props.editable) {
      return null;
    }

    return <QuestionVoting question={this.props.question} />;
  }

  maybeRenderAdminButtons() {
    if (!this.props.editable) {
      return null;
    }

    return (
      <div>
        <button onClick={this.props.editQuestion} className={styles.editBtn}>
          <img src="/images/action-icons/edit.svg" />
        </button>
        <button
          onClick={this.props.deleteQuestion}
          className={styles.appQuestionsQuestionRemoveIcon}
        />
      </div>
    );
  }

  maybeRenderDeleteButton() {
    if (!this.props.unselectable) {
      return null;
    }

    return (
      <div className={styles.appQuestionsQuestionRemoveContainer}>
        <button
          className={styles.appQuestionsQuestionRemoveIcon}
          onClick={this.props.deleteQuestion}
        />
      </div>
    );
  }
}

// tslint:disable-next-line:max-classes-per-file
export default class QuestionItem extends React.Component<QuestionItemOwnProps, QuestionItemState> {
  state: QuestionItemState = {
    isQuestionBeingRemoved: false,
  };

  shouldComponentUpdate(
    nextProps: Readonly<QuestionItemOwnProps>,
    nextState: Readonly<QuestionItemState>
  ): boolean {
    return !isEqual(this.props, nextProps) || !isEqual(this.state, nextState);
  }

  componentWillUnmount() {
    if (this.state.isQuestionBeingRemoved) {
      this.stopDeletionTimer();
      this.props.toggleQuestion(this.props.question.id);
    }
  }

  render() {
    const { question, selectable, unselectable, editable } = this.props;
    const { isQuestionBeingRemoved } = this.state;
    const isSelected = this.isCurrentQuestionSelected();

    return (
      <article
        key={question.id}
        itemScope
        itemType="http://schema.org/Question"
        id={`question-${question.id}`}
      >
        <div className={styles.appQuestionsQuestionContainer}>
          {this.maybeRenderDeleteProgress()}
          <AnimateHeight enterTime={700} exitTime={700} in={!isQuestionBeingRemoved}>
            <QuestionContent
              selectable={selectable}
              unselectable={unselectable}
              isSelected={isSelected}
              editable={editable}
              isQuestionBeingRemoved={isQuestionBeingRemoved}
              question={question}
              toggleQuestion={this.toggleQuestion}
              deleteQuestion={this.deleteQuestion}
              editQuestion={this.editQuestion}
            />
          </AnimateHeight>
        </div>
      </article>
    );
  }

  maybeRenderDeleteProgress() {
    if (!this.props.unselectable) {
      return null;
    }

    return (
      <div
        className={classNames(styles.appQuestionsQuestion, styles.appQuestionsQuestionDeleted, {
          [styles.beingRemoved]: this.state.isQuestionBeingRemoved,
        })}
        onMouseOver={this.stopDeletionTimer}
        onMouseLeave={this.startDeletionTimer}
      >
        <div className={classNames(styles.actionIcon, 'action-icon_warning icon-small')} />
        <p>Usunąłeś pytanie ze swojej listy!</p>
        <button className="round-button branding-button-inverse" onClick={this.undoDeleteQuestion}>
          Cofnij
        </button>
        {this.state.questionRemovalTimer && (
          <div className={styles.appQuestionsQuestionDeletedProgress} />
        )}
      </div>
    );
  }

  toggleQuestion = () => {
    this.props.toggleQuestion(this.props.question.id);
  };

  deleteQuestion = () => {
    if (this.props.editable) {
      if (window.confirm('Czy na pewno chcesz usunąć to pytanie?')) {
        this.props.toggleQuestion(this.props.question.id);
      }
    } else {
      this.setState({ isQuestionBeingRemoved: true }, () => {
        this.startDeletionTimer();
      });
      this.reportEventOnSelectedQuestions('Usuń pytanie', 'Klik', this.props.question.id);
    }
  };

  editQuestion = () => {
    if (this.props.editable && this.props.editQuestion) {
      this.props.editQuestion(this.props.question.id);
    }
  };

  undoDeleteQuestion = () => {
    this.setState({ isQuestionBeingRemoved: false }, () => {
      this.stopDeletionTimer();
    });
    this.reportEventOnSelectedQuestions('Usuń pytanie', 'Anuluj usuwanie', this.props.question.id);
  };

  reportEventOnSelectedQuestions(action: string, label?: string, questionId?: number) {
    globalReportEvent(action, 'Wybrane pytania', label, questionId);
  }

  startDeletionTimer = () => {
    const { question } = this.props;

    if (!this.state.isQuestionBeingRemoved) {
      return;
    }
    if (this.state.questionRemovalTimer) {
      return;
    }

    const questionRemovalTimer = setTimeout(() => {
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
