import classNames from 'classnames';
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import spinnerStyles from '../../components/layout/appSpinner.module.scss';
import { TechnologyKey } from '../../constants/technology-icon-items';
import { ActionCreators } from '../../redux/actions';
import { AppState } from '../../redux/reducers/index';
import { Question } from '../../redux/reducers/questions';
import { Container } from '../container/Container';
import { CommonModalProps } from '../modals/baseModal/BaseModal';
import QuestionsList from '../questions/questionsList/QuestionsList';
import questionListStyles from '../questions/questionsList/questionsList.module.scss';
import noQuestionsStyles from '../questions/selectedQuestions/noQuestionsSelectedInfo.module.scss';

type AdminQuestionsProps = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;
const AdminQuestions: React.FC<AdminQuestionsProps> = React.memo(
  ({
    fetchQuestionsForAdmin,
    selectedLevels,
    deleteQuestionForAdmin,
    questions,
    uiOpenEditQuestionModal,
  }) => {
    const [status, setStatus] = useState<'pending' | 'accepted'>('pending');
    const [technology] = useState<TechnologyKey | undefined>(undefined);

    const refetchQuestions = React.useCallback(() => {
      fetchQuestionsForAdmin({
        technology,
        selectedLevels,
        status,
      });
    }, [fetchQuestionsForAdmin, selectedLevels, status, technology]);

    useEffect(() => {
      refetchQuestions();
    }, [refetchQuestions, selectedLevels, status]);

    const onEditFinished: CommonModalProps['onClose'] = React.useCallback(
      (e) => {
        if (e.reason && e.reason === 'submit') {
          refetchQuestions();
        }
      },
      [refetchQuestions]
    );

    const toggleQuestion = React.useCallback(
      (questionId: Question['id']) => {
        deleteQuestionForAdmin(questionId);
      },
      [deleteQuestionForAdmin]
    );

    const editQuestion = React.useCallback(
      (questionId: Question['id']) => {
        if (!questions.data) {
          return;
        }

        const question = questions.data.data.find((q) => q.id === questionId);
        if (!question) {
          return;
        }

        uiOpenEditQuestionModal(question, onEditFinished);
      },
      [questions.data, uiOpenEditQuestionModal, onEditFinished]
    );

    const maybeRenderEmptyMessage = () => {
      if (!questions.data || questions.data.data.length > 0) {
        return null;
      }
      return (
        <div className={questionListStyles.appQuestionsList} style={{ flex: 1 }}>
          <Container className={noQuestionsStyles.selectedQuestionsEmpty}>
            <p>Nie ma żadnych pytań do zaakceptowania!</p>
          </Container>
        </div>
      );
    };

    const updateStatus: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
      setStatus(e.currentTarget.value as 'pending' | 'accepted');
    };

    if (!questions || questions.isLoading) {
      return null;
    }

    return (
      <>
        <label>
          {' '}
          Status:
          <select onChange={updateStatus} value={status}>
            <option value="pending">pending</option>
            <option value="accepted">accepted</option>
          </select>
        </label>
        {questions.isLoading && <div className={spinnerStyles.spinner} />}
        {maybeRenderEmptyMessage()}
        <QuestionsList
          selectable={false}
          unselectable={false}
          editable={true}
          questions={questions}
          selectedQuestionIds={[]}
          toggleQuestion={toggleQuestion}
          editQuestion={editQuestion}
        />
      </>
    );
  }
);

const mapStateToProps = (state: AppState) => {
  return {
    questions: state.questions,
    selectedLevels: state.selectedLevels,
  };
};

const mapDispatchToProps = {
  fetchQuestionsForAdmin: ActionCreators.fetchQuestionsForAdmin,
  deleteQuestionForAdmin: ActionCreators.deleteQuestionForAdmin,
  uiOpenEditQuestionModal: ActionCreators.uiOpenEditQuestionModal,
};

export default connect(mapStateToProps, mapDispatchToProps)(AdminQuestions);
