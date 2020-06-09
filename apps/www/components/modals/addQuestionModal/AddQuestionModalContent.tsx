import classNames from 'classnames';
import React, { memo } from 'react';

import { LevelKey, levelsWithLabels } from '../../../constants/level';
import { TechnologyKey, technologyIconItems } from '../../../constants/technology-icon-items';
import { Question } from '../../../redux/reducers/questions';
import { QuestionEditor } from '../../questionEditor/QuestionEditor';
import modalStyles from '../baseModal/baseModal.module.scss';

import styles from './addQuestionModal.module.scss';

type AddQuestionModalContentProps = {
  originalQuestion?: Question;
  handleChangeTechnology: React.ChangeEventHandler<HTMLSelectElement>;
  handleChangeLevel: React.ChangeEventHandler<HTMLSelectElement>;
  handleChangeQuestionText: (text: string) => void;
  technology?: TechnologyKey;
  level?: LevelKey;
  questionText: string;
};

export const AddQuestionModalContent = memo<AddQuestionModalContentProps>(
  ({
    originalQuestion,
    level,
    technology,
    questionText,
    handleChangeTechnology,
    handleChangeLevel,
    handleChangeQuestionText,
  }) => {
    return (
      <div>
        <h2 className={modalStyles.appModalTitle} id="add-question-modal-title">
          {originalQuestion ? 'Edytuj pytanie' : 'Nowe pytanie'}
        </h2>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className={styles.appQuestionForm}>
            <div className={styles.appQuestionFormOptionsContainer}>
              <select
                required
                className={classNames(styles.appSelect, styles.appQuestionFormTechnology)}
                value={technology || ''}
                onChange={handleChangeTechnology}
              >
                <option key="undefined" value="" disabled={true}>
                  Wybierz technologię
                </option>
                {technologyIconItems.map((technology) => (
                  <option key={technology.name} value={technology.name}>
                    {technology.label}
                  </option>
                ))}
              </select>
              <select
                required
                className={classNames(styles.appSelect, styles.appQuestionFormLevel)}
                value={level || ''}
                onChange={handleChangeLevel}
              >
                <option key="undefined" value="" disabled={true}>
                  Wybierz poziom
                </option>
                {levelsWithLabels.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <QuestionEditor
              id="add-question-modal"
              onChange={handleChangeQuestionText}
              value={questionText}
            />
          </div>
        </form>
      </div>
    );
  }
);
