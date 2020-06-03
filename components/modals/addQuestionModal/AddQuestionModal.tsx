import classNames from 'classnames';
import { isEqual } from 'lodash';
import React from 'react';
import { connect } from 'react-redux';

import { levelsWithLabels, LevelKey } from '../../../constants/level';
import { technologyIconItems, TechnologyKey } from '../../../constants/technology-icon-items';
import { ActionCreators } from '../../../redux/actions';
import { Question } from '../../../redux/reducers/questions';
import { Api } from '../../../services/Api';
import QuestionEditor from '../../questionEditor/QuestionEditor';
import BaseModal, { CommonModalProps } from '../baseModal/BaseModal';

import styles from './addQuestionModal.module.scss';

interface AddQuestionModalState {
  technology?: TechnologyKey;
  level?: LevelKey;
  questionText: string;
  isLoading: boolean;
  valid: boolean;
  originalQuestion?: Question;
}

interface AddQuestionModalOwnProps {
  originalQuestion?: Question;
}

type AddQuestionModalProps = AddQuestionModalOwnProps &
  CommonModalProps &
  ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps;

class AddQuestionModalComponent extends React.PureComponent<
  AddQuestionModalProps,
  AddQuestionModalState
> {
  static getDerivedStateFromProps: React.GetDerivedStateFromProps<
    AddQuestionModalProps,
    AddQuestionModalState
  > = (props, state) => {
    if (!props.originalQuestion || isEqual(props.originalQuestion, state.originalQuestion)) {
      return null;
    }

    const { originalQuestion } = props;

    return {
      originalQuestion,
      level: originalQuestion._levelId,
      technology: originalQuestion._categoryId,
      questionText: originalQuestion.question,
    };
  };

  state: AddQuestionModalState = { questionText: '', isLoading: false, valid: false };

  componentDidMount() {
    this.reportEvent('Wyświetlenie');
    this.setState((state) => ({ valid: this.isValid(state) }));
  }

  render() {
    return (
      <BaseModal
        type="add"
        className={styles.addQuestionModal}
        closable={true}
        renderContent={this.renderContent}
        renderFooter={this.renderFooter}
        onClose={this.onClose}
        aria-labelledby="addQuestionModalTitle"
      />
    );
  }

  onCancelClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    this.onClose({ reason: 'cancel', event: e });
  };

  onClose: CommonModalProps['onClose'] = (args) => {
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
        <h2 className={styles.appModalTitle} id="add-question-modal-title">
          {this.state.originalQuestion ? 'Edytuj pytanie' : 'Nowe pytanie'}
        </h2>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className={styles.appQuestionForm}>
            <div className={styles.appQuestionFormOptionsContainer}>
              <select
                required
                className={classNames('app-select', styles.appQuestionFormTechnology)}
                value={this.state.technology || ''}
                onChange={this.handleChangeTechnology}
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
                className={classNames('app-select', styles.appQuestionFormLevel)}
                value={this.state.level || ''}
                onChange={this.handleChangeLevel}
              >
                <option key="undefined" value="" disabled={true}>
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
          className={classNames('round-button', styles.brandingButtonInverse, {
            loading: this.state.isLoading,
          })}
          disabled={!this.state.valid || this.state.isLoading}
          type="button"
          onClick={this.handleSubmit}
        >
          {this.state.originalQuestion ? 'Akceptuj' : 'Dodaj pytanie'}
        </button>
        <button className="round-button branding-button" onClick={this.onCancelClick}>
          Anuluj
        </button>
      </div>
    );
  };

  handleChangeTechnology: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    const value = e.currentTarget.value as TechnologyKey;
    this.setState(
      {
        technology: value,
      },
      this.validate
    );
  };

  handleChangeLevel: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    const value = e.currentTarget.value as LevelKey;
    this.setState(
      {
        level: value,
      },
      this.validate
    );
  };

  handleChangeQuestionText = (text: string) => {
    this.setState(
      {
        questionText: text,
      },
      this.validate
    );
  };

  validate = () => {
    this.setState((state) => ({
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

    const body = {
      question: this.state.questionText,
      level: this.state.level,
      category: this.state.technology,
    };

    if (this.state.originalQuestion) {
      return Api.updateQuestion(this.state.originalQuestion.id, {
        ...body,
        status: 'accepted',
      })
        .then(() => {
          this.onClose({ reason: 'submit' });
        })
        .finally(() => this.setState({ isLoading: false }));
    } else {
      return Api.createQuestion(body)
        .then(() => {
          this.onClose({ reason: 'submit' });
          this.props.uiOpenAddQuestionConfirmationModal();
        })
        .finally(() => this.setState({ isLoading: false }));
    }
  };

  reportEvent(action: string) {
    globalReportEvent(action, 'Nowe pytanie warstwa');
  }
}

const mapStateToProps = (_state: any, _ownProps: AddQuestionModalOwnProps) => ({});

const mapDispatchToProps = {
  uiOpenAddQuestionConfirmationModal: ActionCreators.uiOpenAddQuestionConfirmationModal,
};

const AddQuestionModal = connect(mapStateToProps, mapDispatchToProps)(AddQuestionModalComponent);
export default AddQuestionModal;
