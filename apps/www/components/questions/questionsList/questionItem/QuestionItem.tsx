import classNames from 'classnames';
import { isEqual, noop } from 'lodash';
import dynamic from 'next/dynamic';
import React, { memo, useRef, useCallback, useMemo, useState, forwardRef } from 'react';

import { Question } from '../../../../redux/reducers/questions';
import { useWillUnmount } from '../../../../utils/hooks';
import { ActiveLink } from '../../../activeLink/ActiveLink';
import { AnimateHeight } from '../../../animateProperty/AnimateProperty';
import { isQuestionSelected } from '../../questionsUtils';

import QuestionVoting from './QuestionVoting';
import styles from './questionItem.module.scss';

const MarkdownText = dynamic(() =>
  import(/* webpackChunkName: "MarkdownText" */ '../../../markdownText/MarkdownText')
);

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
  forwardRef?: React.RefObject<HTMLDivElement>;
}

export const QuestionContent = memo<QuestionContentProps>(
  ({
    question,
    isSelected,
    forwardRef,
    selectable,
    unselectable,
    editable,
    toggleQuestion,
    editQuestion,
    deleteQuestion,
  }) => {
    const maybeRenderCheckbox = () => {
      if (!selectable) {
        return null;
      }

      return (
        <input
          onChange={toggleQuestion}
          checked={isSelected}
          type="checkbox"
          className={styles.appQuestionsQuestionCheckbox}
        />
      );
    };

    const renderMeta = () => {
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
    };

    const maybeRenderVoting = () => {
      if (editable) {
        return null;
      }

      return <QuestionVoting question={question} />;
    };

    const maybeRenderAdminButtons = () => {
      if (!editable) {
        return null;
      }

      return (
        <div>
          <button onClick={editQuestion} className={styles.editBtn}>
            <img src="/images/action-icons/edit.svg" alt="Edit question" />
          </button>
          <button onClick={deleteQuestion} className={styles.appQuestionsQuestionRemoveIcon} />
        </div>
      );
    };

    const maybeRenderDeleteButton = () => {
      if (!unselectable) {
        return null;
      }

      return (
        <div className={styles.appQuestionsQuestionRemoveContainer}>
          <button className={styles.appQuestionsQuestionRemoveIcon} onClick={deleteQuestion} />
        </div>
      );
    };

    return (
      <div
        ref={forwardRef}
        className={classNames(styles.appQuestionsQuestion, {
          [styles.active]: isSelected,
        })}
      >
        <div className={styles.appQuestionsContentContainer}>
          {maybeRenderCheckbox()}
          {maybeRenderAdminButtons()}

          <div className={styles.appQuestionsQuestionText} itemProp="text">
            <MarkdownText value={question.question} />
          </div>

          {renderMeta()}
          {maybeRenderDeleteButton()}
        </div>
        {maybeRenderVoting()}
      </div>
    );
  }
);

type QuestionItemDeleteProgressProps = {
  stopDeletionTimer: () => void;
  startDeletionTimer: () => void;
  undoDeleteQuestion: () => void;
  questionRemovalTimer?: NodeJS.Timeout;
  isQuestionBeingRemoved: boolean;
};

const QuestionItemDeleteProgress: React.FC<QuestionItemDeleteProgressProps> = memo(
  ({
    stopDeletionTimer,
    startDeletionTimer,
    undoDeleteQuestion,
    questionRemovalTimer,
    isQuestionBeingRemoved,
  }) => {
    return (
      <div
        className={classNames(styles.appQuestionsQuestion, styles.appQuestionsQuestionDeleted, {
          [styles.beingRemoved]: isQuestionBeingRemoved,
        })}
        onMouseOver={stopDeletionTimer}
        onMouseLeave={isQuestionBeingRemoved ? startDeletionTimer : noop}
      >
        <div className={classNames(styles.actionIcon, 'action-icon_warning icon-small')} />
        <p>Usunąłeś pytanie ze swojej listy!</p>
        <button className="round-button branding-button-inverse" onClick={undoDeleteQuestion}>
          Cofnij
        </button>
        {questionRemovalTimer && <div className={styles.appQuestionsQuestionDeletedProgress} />}
      </div>
    );
  }
);

export const QuestionItem = memo(
  forwardRef<HTMLElement, QuestionItemOwnProps>(
    (
      {
        question,
        selectable,
        unselectable,
        editable,
        toggleQuestion,
        editQuestion,
        selectedQuestionIds,
      },
      ref
    ) => {
      const questionRemovalTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);
      const [isQuestionBeingRemoved, setIsQuestionBeingRemoved] = useState<boolean>(false);
      const [, rerender] = useState();

      const toggleCurrentQuestion = useCallback(() => toggleQuestion(question.id), [
        question.id,
        toggleQuestion,
      ]);

      const editCurrentQuestion = useCallback(() => {
        if (editable && editQuestion) {
          editQuestion(question.id);
        }
      }, [editQuestion, editable, question.id]);

      const reportEventOnSelectedQuestions = useCallback(
        (action: string, label?: string, questionId?: number) =>
          globalReportEvent(action, 'Wybrane pytania', label, questionId),
        []
      );

      const stopDeletionTimer = useCallback(() => {
        if (!questionRemovalTimerRef.current || !isQuestionBeingRemoved) {
          return;
        }

        clearTimeout(questionRemovalTimerRef.current);
        questionRemovalTimerRef.current = undefined;
        rerender({});
      }, [isQuestionBeingRemoved]);

      const undoDeleteQuestion = useCallback(() => {
        setIsQuestionBeingRemoved(false);
        stopDeletionTimer();
        reportEventOnSelectedQuestions('Usuń pytanie', 'Anuluj usuwanie', question.id);
      }, [question.id, reportEventOnSelectedQuestions, stopDeletionTimer]);

      const startDeletionTimer = useCallback(() => {
        if (questionRemovalTimerRef.current) {
          return;
        }

        questionRemovalTimerRef.current = setTimeout(() => {
          toggleCurrentQuestion();
        }, QUESTION_DELETION_DELAY);
        setIsQuestionBeingRemoved(true);
        rerender({});
      }, [toggleCurrentQuestion]);

      const deleteCurrentQuestion = useCallback(() => {
        if (editable) {
          if (window.confirm('Czy na pewno chcesz usunąć to pytanie?')) {
            toggleQuestion(question.id);
          }
        } else {
          startDeletionTimer();
          setIsQuestionBeingRemoved(true);
          reportEventOnSelectedQuestions('Usuń pytanie', 'Klik', question.id);
        }
      }, [
        editable,
        question.id,
        reportEventOnSelectedQuestions,
        startDeletionTimer,
        toggleQuestion,
      ]);

      const isCurrentQuestionSelected = useMemo(
        () => isQuestionSelected(selectedQuestionIds, question.id),
        [question.id, selectedQuestionIds]
      );

      useWillUnmount(() => {
        if (questionRemovalTimerRef.current) {
          stopDeletionTimer();
          toggleQuestion(question.id);
        }
      });

      const contentRef = useRef<HTMLDivElement>(null);

      return (
        <article
          ref={ref}
          key={question.id}
          itemScope
          itemType="http://schema.org/Question"
          id={`question-${question.id}`}
        >
          <div className={styles.appQuestionsQuestionContainer}>
            {unselectable && (
              <QuestionItemDeleteProgress
                stopDeletionTimer={stopDeletionTimer}
                startDeletionTimer={startDeletionTimer}
                undoDeleteQuestion={undoDeleteQuestion}
                questionRemovalTimer={questionRemovalTimerRef.current}
                isQuestionBeingRemoved={isQuestionBeingRemoved}
              />
            )}
            <AnimateHeight
              nodeRef={contentRef}
              enterTime={700}
              exitTime={700}
              in={!isQuestionBeingRemoved}
            >
              <QuestionContent
                forwardRef={contentRef}
                selectable={selectable}
                unselectable={unselectable}
                isSelected={isCurrentQuestionSelected}
                editable={editable}
                isQuestionBeingRemoved={isQuestionBeingRemoved}
                question={question}
                toggleQuestion={toggleCurrentQuestion}
                deleteQuestion={deleteCurrentQuestion}
                editQuestion={editCurrentQuestion}
              />
            </AnimateHeight>
          </div>
        </article>
      );
    }
  ),
  (prevProps, nextProps) => isEqual(prevProps, nextProps)
);
