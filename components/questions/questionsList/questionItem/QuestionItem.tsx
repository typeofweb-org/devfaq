import './questionItem.scss';
import * as React from 'react';
import { Question } from '../../../../redux/reducers/questions';
import * as classNames from 'classnames';

import { pl } from 'date-fns/locale';
import { formatWithOptions } from 'date-fns/fp';
import { isQuestionSelected } from '../../questionsUtils';
import MarkdownText from '../../../markdownText/MarkdownText';

const longDate = formatWithOptions({ locale: pl }, 'LL');
const shortDate = formatWithOptions({ locale: pl }, 'L');

type QuestionItemOwnProps = {
  question: Question;
  selectable: boolean;
  removable: boolean;
  selectedQuestionIds: number[];
  toggleQuestion(questionId: Question['id']): any;
};

export default class QuestionItem extends React.Component<QuestionItemOwnProps> {
  render() {
    const { question } = this.props;

    const isSelected = this.isCurrentQuestionSelected();

    return (
      <article key={question.id}>
        <div
          className={classNames('app-questions--question', {
            active: isSelected,
          })}
        >
          {this.props.selectable && (
            <input
              onChange={() => this.props.toggleQuestion(question.id)}
              checked={isSelected}
              type="checkbox"
              className="app-questions--question--checkbox"
            />
          )}

          <MarkdownText className="app-questions--question--text" value={question.question} />

          <div className="app-questions--question--meta">
            <span
              className={classNames('app-questions--question--tag', `app-questions--question--tag_${question.level}`)}
            >
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

          {this.props.removable && (
            <div className="app-questions--question--remove-container">
              <button
                className="app-questions--question--remove--icon"
                onClick={() => this.props.toggleQuestion(question.id)}
              />
            </div>
          )}
        </div>
      </article>
    );
  }

  private isCurrentQuestionSelected = () => {
    return isQuestionSelected(this.props.selectedQuestionIds, this.props.question.id);
  };

  editQuestion = (_question: Question) => {};
  deleteQuestionForever = (_question: Question) => {};
}
