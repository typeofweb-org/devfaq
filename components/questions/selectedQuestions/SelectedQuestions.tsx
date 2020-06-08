import React, { useCallback, memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { TransitionGroup } from 'react-transition-group';
import { isEqual } from 'lodash';

import { TechnologyKey, technologyIconItems } from '../../../constants/technology-icon-items';
import { ActionCreators } from '../../../redux/actions';
import { Question } from '../../../redux/reducers/questions';
import {
  getAreAnyQuestionSelected,
  getSelectedQuestionsIds,
  getSelectedQuestionsWithCategories,
} from '../../../redux/selectors/selectors';
import { AnimateHeight } from '../../animateProperty/AnimateProperty';
import QuestionsList from '../questionsList/QuestionsList';

import NoQuestionsSelectedInfo from './NoQuestionsSelectedInfo';
import styles from './selectedQuestions.module.scss';

const SelectedQuestions = memo(
  () => {
    const selectedQuestionsWithCategories = useSelector(getSelectedQuestionsWithCategories);
    const selectedQuestionIds = useSelector(getSelectedQuestionsIds);
    const areAnyQuestionSelected = useSelector(getAreAnyQuestionSelected);
    const dispatch = useDispatch();

    const renderSelectedQuestionsList = () => {
      return selectedQuestionsWithCategories.map(([category, questions]) => {
        return renderSelectedQuestionsCategory(category, questions);
      });
    };

    const renderSelectedQuestionsCategory = (category: TechnologyKey, questions: Question[]) => {
      const icon = technologyIconItems.find((i) => i.name === category)!;
      const sectionRef = React.createRef<HTMLElement>();

      return (
        <AnimateHeight nodeRef={sectionRef} enterTime={700} exitTime={700} key={category}>
          <section ref={sectionRef} className={styles.selectedQuestionsCategory}>
            <div className={styles.selectedQuestionsListContainer}>
              <div className={styles.technologyIconContainer}>
                <span className={styles.technologyIconLabel}>{icon.label}</span>
                <span className={icon.icon} />
              </div>
              <QuestionsList
                className={styles.appQuestionsList}
                selectedQuestionIds={selectedQuestionIds}
                questions={{ isLoading: false, data: { data: questions } }}
                selectable={false}
                unselectable={true}
                toggleQuestion={toggleQuestion}
              />
            </div>
          </section>
        </AnimateHeight>
      );
    };

    const toggleQuestion = useCallback(
      (questionId: Question['id']) => {
        dispatch(() => ActionCreators.deselectQuestion(questionId));
      },
      [dispatch]
    );

    if (areAnyQuestionSelected) {
      return (
        <TransitionGroup
          appear={false}
          enter={false}
          className={styles.selectedQuestionsContainer}
          component="div"
        >
          {renderSelectedQuestionsList()}
        </TransitionGroup>
      );
    } else {
      return <NoQuestionsSelectedInfo />;
    }
  },
  (prevProps, nextProps) => isEqual(prevProps, nextProps)
);

export default SelectedQuestions;
