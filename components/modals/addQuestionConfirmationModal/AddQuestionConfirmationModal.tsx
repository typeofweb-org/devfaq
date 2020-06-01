import BaseModal, { CommonModalProps } from '../baseModal/BaseModal';
import React from 'react';
import styles from './addQuestionConfirmationModal.module.scss';
import classNames from 'classnames';

export default class AddQuestionConfirmationModal extends React.PureComponent<CommonModalProps> {
  componentDidMount() {
    this.reportEvent('Wyświetlenie');
  }

  render() {
    return (
      <BaseModal
        type="confirmation"
        className={styles.addQuestionConfirmationModal}
        closable={true}
        renderContent={this.renderContent}
        onClose={this.onClose}
        aria-describedby="add-question-confirmation-modal-description"
      />
    );
  }

  onClose: CommonModalProps['onClose'] = (arg) => {
    if (arg.reason === 'ok') {
      this.reportEvent('OK');
    } else {
      this.reportEvent('Zamknij');
    }

    this.props.onClose(arg);
  };

  renderContent = () => {
    return (
      <div className={styles.addQuestionConfirmationModal}>
        <p id="add-question-confirmation-modal-description">
          Jeszcze momencik… a Twoje pytanie pojawi się na liście dostępnych pytań. Najpierw musimy
          rzucić na nie okiem i zatwierdzić.
          <br /> W międzyczasie zajrzyj na nasze blogi ❤️
        </p>
        <div className={styles.logos}>
          <a
            href="https://typeofweb.com/"
            target="_blank"
            title="Type of Web"
            onClick={() => this.reportEvent('Type of Web - klik')}
          >
            <img src="/images/type_of_web_logo.png" alt="Type of Web" />
          </a>
        </div>
        <button
          className={classNames(styles.roundButton, 'alternative-button')}
          onClick={this.close}
        >
          OK!
        </button>
      </div>
    );
  };

  reportEvent(action: string) {
    globalReportEvent(action, 'Przesłane nowe pytanie warstwa');
  }

  close: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    this.onClose({ event: e, reason: 'ok' });
  };
}
