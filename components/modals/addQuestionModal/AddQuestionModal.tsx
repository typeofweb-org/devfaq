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

interface AddQuestionModalState {
  technology?: TechnologyKey;
  level?: LevelKey;
  questionText: string;
  isLoading: boolean;
  valid: boolean;
}

class AddQuestionModalComponent extends React.PureComponent<
  CommonModalProps & ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps,
  AddQuestionModalState
> {
  state: AddQuestionModalState = { questionText: '', isLoading: false, valid: false };

  componentDidMount() {
    this.reportEvent('Wyświetlenie');
  }

  render() {
    return (
      <BaseModal
        type="add"
        className="add-question-modal"
        closable={true}
        renderContent={this.renderContent}
        renderFooter={this.renderFooter}
        onClose={this.onClose}
        aria-labelledby="add-question-modal-title"
      />
    );
  }

  onCancelClick: React.MouseEventHandler<HTMLButtonElement> = e => {
    this.onClose({ reason: 'cancel', event: e });
  };

  onClose: CommonModalProps['onClose'] = args => {
    if (args.reason === 'cancel') {
      this.reportEvent('Anuluj');
    } else if (args.reason === 'submit') {
      this.reportEvent('Dodaj pytanie');
    } else {
      this.reportEvent('Zamknij');
    }
    this.props.onClose(args);
  };

  renderContent = () => {
    return (
      <div>
        <h2 className="app-modal--title" id="add-question-modal-title">
          Nowe pytanie
        </h2>
        <form onSubmit={e => e.preventDefault()}>
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
                {technologyIconItems.map(technology => (
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
                {levelsWithLabels.map(level => (
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
          className={classNames('round-button', 'branding-button-inverse', {
            loading: this.state.isLoading,
          })}
          disabled={!this.state.valid || this.state.isLoading}
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

  handleChangeTechnology: React.ChangeEventHandler<HTMLSelectElement> = e => {
    const value = e.currentTarget.value as TechnologyKey;
    this.setState(state => ({
      technology: value,
      valid: this.isValid(state),
    }));
  };

  handleChangeLevel: React.ChangeEventHandler<HTMLSelectElement> = e => {
    const value = e.currentTarget.value as LevelKey;
    this.setState(state => ({
      level: value,
      valid: this.isValid(state),
    }));
  };

  handleChangeQuestionText = (text: string) => {
    this.setState(state => ({
      questionText: text,
      valid: this.isValid(state),
    }));
  };

  isValid(state: AddQuestionModalState): state is Required<AddQuestionModalState> {
    return Boolean(state.level && state.technology && state.questionText.trim());
  }

  handleSubmit: React.MouseEventHandler<HTMLButtonElement> = () => {
    if (!this.isValid(this.state)) {
      return;
    }

    this.setState({ isLoading: true });
    return Api.createQuestion({
      question: this.state.questionText,
      level: this.state.level,
      category: this.state.technology,
    })
      .then(() => {
        this.onClose({ reason: 'submit' });
        this.props.uiOpenAddQuestionConfirmationModal();
      })
      .finally(() => this.setState({ isLoading: false }));
  };

  reportEvent(action: string) {
    globalReportEvent(action, 'Nowe pytanie warstwa');
  }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = {
  uiCloseAddQuestionModal: ActionCreators.uiCloseAddQuestionModal,
  uiOpenAddQuestionConfirmationModal: ActionCreators.uiOpenAddQuestionConfirmationModal,
};

const AddQuestionModal = connect(
  mapStateToProps,
  mapDispatchToProps
)(AddQuestionModalComponent);
export default AddQuestionModal;
