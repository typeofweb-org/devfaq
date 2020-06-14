import React, { useCallback, useMemo } from 'react';
import { connect } from 'react-redux';

import { Level } from '../../../constants/level';
import { technologyIconItems, Technology } from '../../../constants/technology-icon-items';
import { ActionCreators } from '../../../redux/actions';
import { AppState } from '../../../redux/reducers/index';
import { Question } from '../../../redux/reducers/questions';
import {
  getSelectedQuestionsIds,
  getTechnology,
  getSortBy,
} from '../../../redux/selectors/selectors';
import QuestionsPagination from '../../questionsPagination/QuestionsPagination';
import QuestionsList from '../questionsList/QuestionsList';
import { isQuestionSelected } from '../questionsUtils';

import styles from './allQuestions.module.scss';
import { AllQuestionsFooter } from './allQuestionsFooter/AllQuestionsFooter';
import { AllQuestionsHeader } from './allQuestionsHeader/AllQuestionsHeader';
import { useQuestionsFilter } from '../../../utils/useFilter';

type AllQuestionsComponentProps = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

const AllQuestionsComponent = React.memo<AllQuestionsComponentProps>(
  ({
    questions,
    selectedQuestionsIds,
    route,
    uiOpenAddQuestionModal,
    selectQuestion,
    deselectQuestion,
  }) => {
    const filter = useQuestionsFilter();
    const technologyIconItem = useMemo(
      () => technologyIconItems.find((t) => t.name === filter.selected.technology),
      [filter.selected.technology]
    );
    const category = technologyIconItem?.label || '';

    const length = questions.data?.meta?.total;

    const changeSortBy: React.ChangeEventHandler<HTMLSelectElement> = useCallback(
      (e) => {
        filter.updateFilter({ sortBy: e.currentTarget.value.split(/[,*]/) }, false);
      },
      [route.query]
    );

    const reportEvent = useCallback((action: string, label?: string, questionId?: number) => {
      globalReportEvent(action, 'Lista pytań', label, questionId);
    }, []);

    const onAddNewClick = useCallback(() => {
      reportEvent('CTA Dodaj nowe pytanie');
      uiOpenAddQuestionModal();
    }, [uiOpenAddQuestionModal, reportEvent]);

    const toggleQuestion = useCallback(
      (questionId: Question['id']) => {
        const isSelected = isQuestionSelected(selectedQuestionsIds, questionId);
        const question = questions.data && questions.data.data.find((q) => q.id === questionId);

        if (isSelected) {
          deselectQuestion(questionId);
        } else if (question) {
          selectQuestion(question);
        }

        if (!question) {
          return;
        }

        const action = isSelected
          ? 'Checkbox - odznaczone pytanie'
          : 'Checkbox - zaznaczone pytanie';
        reportEvent(
          action,
          `${Technology[question._categoryId]}, ${Level[question._levelId]}`,
          question.id
        );
      },
      [questions.data, deselectQuestion, selectQuestion, selectedQuestionsIds, reportEvent]
    );

    const renderList = () => {
      if (questions.error) {
        return (
          <div>
            <div>{questions.error.name}</div>
            <div>{questions.error.message}</div>
            <div>{questions.error.stack}</div>
          </div>
        );
      }
      if (!questions.data || questions.data.data.length === 0) {
        return null; // @todo handle errors and loading
      }

      return (
        <QuestionsList
          selectable={true}
          unselectable={false}
          questions={questions}
          selectedQuestionIds={selectedQuestionsIds}
          toggleQuestion={toggleQuestion}
        />
      );
    };

    return (
      <section className={styles.appQuestions}>
        {questions.data && filter.selected.technology && (
          <AllQuestionsHeader
            category={category}
            questionsLength={length}
            onSortByChange={changeSortBy}
            sortBy={filter.selected.sortBy || ['acceptedAt', 'desc']}
          />
        )}
        {renderList()}
        {questions.data && filter.selected.technology && (
          <AllQuestionsFooter onAddNewClick={onAddNewClick} />
        )}
        <QuestionsPagination />
      </section>
    );
  }
);

const mapStateToProps = (state: AppState) => {
  return {
    technology: getTechnology(state),
    questions: state.questions,
    selectedQuestionsIds: getSelectedQuestionsIds(state),
    sortBy: getSortBy(state),
    route: state.routeDetails.current,
  };
};

const mapDispatchToProps = {
  selectQuestion: ActionCreators.selectQuestion,
  deselectQuestion: ActionCreators.deselectQuestion,
  uiOpenAddQuestionModal: ActionCreators.uiOpenAddQuestionModal,
};

const AllQuestions = connect(mapStateToProps, mapDispatchToProps)(AllQuestionsComponent);
export default AllQuestions;
