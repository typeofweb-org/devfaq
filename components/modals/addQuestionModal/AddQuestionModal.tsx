import * as React from 'react';
import BaseModal, { CommonModalProps } from '../baseModal/BaseModal';
import * as classNames from 'classnames';
import { technologyIconItems, TechnologyKey } from '../../../constants/technology-icon-items';
import { levelsWithLabels, LevelKey } from '../../../constants/level';
import './addQuestionModal.scss';
import QuestionEditor from '../../questionEditor/QuestionEditor';
import { Api } from '../../../services/Api';
import { connect } from 'react-redux';
import { ActionCreators } from '../../../redux/actions';

type AddQuestionModalState = {
  technology?: TechnologyKey;
  level?: LevelKey;
  questionText: string;
  isLoading: boolean;
};

class AddQuestionModalComponent extends React.Component<
  CommonModalProps & ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps,
  AddQuestionModalState
> {
  state: AddQuestionModalState = { questionText: '', isLoading: false };

  render() {
    return (
      <BaseModal
        type="add"
        className="add-question-modal"
        closable={true}
        renderContent={this.renderContent}
        renderFooter={this.renderFooter}
        onClose={this.props.onClose}
      />
    );
  }

  onCancelClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    this.props.onClose({ reason: 'cancel', event: e });
  };

  renderContent = () => {
    return (
      <div>
        <h2 className="app-modal--title">Nowe pytanie</h2>
        <form>
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
          className={classNames('round-button', 'branding-button-inverse', { loading: this.state.isLoading })}
          disabled={!this.isValid(this.state) || this.state.isLoading}
          type="button"
          onClick={this.handleSubmit}
        >
          Dodaj pytanie
        </button>
        <button className="round-button branding-button" onClick={this.onCancelClick}>
          Anuluj
        </button>
      </div>
    );
  };

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

  isValid(state: AddQuestionModalState): state is Required<AddQuestionModalState> {
    return Boolean(state.level && state.technology && state.questionText.trim());
  }

  handleSubmit: React.MouseEventHandler<HTMLButtonElement> = () => {
    if (!this.isValid(this.state)) {
      return;
    }

    this.setState({ isLoading: true });
    Api.createQuestion({
      question: this.state.questionText,
      level: this.state.level,
      category: this.state.technology,
    })
      .then(() => {
        this.props.uiCloseAddQuestionModal();
        this.props.uiOpenAddQuestionConfirmationModal();
      })
      .finally(() => this.setState({ isLoading: false }));
  };
}

const mapStateToProps = () => ({});

const mapDispatchToProps = {
  uiCloseAddQuestionModal: ActionCreators.uiCloseAddQuestionModal,
  uiOpenAddQuestionConfirmationModal: ActionCreators.uiOpenAddQuestionConfirmationModal,
};

const AddQuestionModal = connect(mapStateToProps, mapDispatchToProps)(AddQuestionModalComponent);
export default AddQuestionModal;
