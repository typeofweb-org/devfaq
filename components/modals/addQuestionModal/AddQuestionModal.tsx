import * as React from 'react';
import BaseModal from '../baseModal/BaseModal';
import * as classNames from 'classnames';
import { technologyIconItems, TechnologyKey } from '../../../constants/technology-icon-items';
import { levelsWithLabels, LevelKey } from '../../../constants/level';
import './addQuestionModal.scss';
import QuestionEditor from '../../questionEditor/QuestionEditor';

type AddQuestionModalState = {
  technology?: TechnologyKey;
  level?: LevelKey;
  questionText: string;
};

export default class AddQuestionModal extends React.Component<{}, AddQuestionModalState> {
  state: AddQuestionModalState = { questionText: '' };

  render() {
    return (
      <BaseModal
        type="add"
        className="add-question-modal"
        closable={true}
        renderContent={this.renderContent}
        renderFooter={this.renderFooter}
      />
    );
  }

  close() {}

  renderContent = () => {
    return (
      <div>
        <h2 className="app-modal--title">Nowe pytanie</h2>
        <form onSubmit={this.handleSubmit}>
          <div className="app-question-form">
            <div className="app-question-form--options-container">
              <select
                required
                className="app-select app-question-form--technology"
                defaultValue="___default"
                value={this.state.technology}
                onChange={this.handleChangeTechnology}
              >
                <option key="undefined" value="___default" disabled={true}>
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
                className="app-select app-question-form--level"
                defaultValue="___default"
                value={this.state.level}
                onChange={this.handleChangeLevel}
              >
                <option key="undefined" value="___default" disabled={true}>
                  Wybierz poziom
                </option>
                {levelsWithLabels.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>

            <QuestionEditor
              id="add-question-modal"
              onChange={this.handleChangeQuestionText}
              value={this.state.questionText}
            />
          </div>
        </form>
      </div>
    );
  };

  renderFooter = () => {
    return (
      <div>
        <button
          className={classNames('round-button', 'branding-button-inverse')}
          disabled={!this.isValid()}
          type="submit"
        >
          Dodaj pytanie
        </button>
        <button className="round-button branding-button" onClick={this.close}>
          Anuluj
        </button>
      </div>
    );
  };

  handleSubmit: React.FormEventHandler<HTMLFormElement> = () => {};

  handleChangeTechnology: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    const value = e.currentTarget.value as TechnologyKey;
    this.setState({
      technology: value,
    });
  };

  handleChangeLevel: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    const value = e.currentTarget.value as LevelKey;
    this.setState({
      level: value,
    });
  };

  handleChangeQuestionText = (text: string) => {
    this.setState({
      questionText: text,
    });
  };

  isValid = (): boolean => {
    return Boolean(this.state.level && this.state.technology && this.state.questionText.trim());
  };
}
