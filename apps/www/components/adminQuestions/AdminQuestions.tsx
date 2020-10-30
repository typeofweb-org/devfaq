import React, { useState, useEffect, memo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import spinnerStyles from '../../components/layout/appSpinner.module.scss';
import { TechnologyKey } from '../../constants/technology-icon-items';
import { useUIContext } from '../../contexts/UIContextProvider';
import { ActionCreators } from '../../redux/actions';
import { Question } from '../../redux/reducers/questions';
import { Container } from '../container/Container';
import { CommonModalProps } from '../modals/baseModal/BaseModal';
import QuestionsList from '../questions/questionsList/QuestionsList';
import questionListStyles from '../questions/questionsList/questionsList.module.scss';
import noQuestionsStyles from '../questions/selectedQuestions/noQuestionsSelectedInfo.module.scss';

const EmptyAdminQuestions = memo(({ questions }: { questions?: Question[] }) => {
  if (!questions?.length) {
    return null;
  }
  return (
    <div className={questionListStyles.appQuestionsList}>
      <Container className={noQuestionsStyles.selectedQuestionsEmpty}>
        <p>Nie ma żadnych pytań do zaakceptowania!</p>
      </Container>
    </div>
  );
});

const AdminQuestions = memo(() => {
  const { openEditQuestionModal } = useUIContext();
  const [status, setStatus] = useState<'pending' | 'accepted'>('pending');
  const [technology] = useState<TechnologyKey | undefined>(undefined);

  const dispatch = useDispatch();

  const questions = useSelector((state) => state.questions);
  const selectedLevels = useSelector((state) => state.selectedLevels);

  const refetchQuestions = useCallback(() => {
    dispatch(
      ActionCreators.fetchQuestionsForAdmin({
        technology,
        selectedLevels,
        status,
      })
    );
  }, [dispatch, selectedLevels, status, technology]);

  useEffect(() => {
    refetchQuestions();
  }, [refetchQuestions]);

  const onEditFinished: CommonModalProps['onClose'] = useCallback(
    (e) => {
      if (e?.reason === 'submit') {
        refetchQuestions();
      }
    },
    [refetchQuestions]
  );

  const toggleQuestion = useCallback(
    (questionId: Question['id']) => {
      dispatch(ActionCreators.deleteQuestionForAdmin(questionId));
    },
    [dispatch]
  );

  const editQuestion = useCallback(
    (questionId: Question['id']) => {
      if (!questions.data) {
        return;
      }

      const question = questions.data.data.find((q) => q.id === questionId);
      if (!question) {
        return;
      }

      openEditQuestionModal(question, onEditFinished);
    },
    [onEditFinished, openEditQuestionModal, questions.data]
  );

  const updateStatus: React.ChangeEventHandler<HTMLSelectElement> = useCallback((e) => {
    setStatus(e.currentTarget.value as 'pending' | 'accepted');
  }, []);

  if (!questions || questions.isLoading) {
    return null;
  }

  return (
    <>
      <label>
        Status:
        <select onChange={updateStatus} value={status}>
          <option value="pending">pending</option>
          <option value="accepted">accepted</option>
        </select>
      </label>
      {questions.isLoading && <div className={spinnerStyles.spinner} />}
      <EmptyAdminQuestions questions={questions.data?.data} />
      <QuestionsList
        selectable={false}
        unselectable={false}
        editable={true}
        questions={questions}
        toggleQuestion={toggleQuestion}
        editQuestion={editQuestion}
      />
    </>
  );
});
export default AdminQuestions;
