import { CommonModalProps } from '../baseModal/BaseModal';
import './addQuestionConfirmationModal.scss';
import * as React from 'react';
import BaseModal from '../baseModal/BaseModal';

export default class AddQuestionConfirmationModal extends React.Component<CommonModalProps> {
  render() {
    return (
      <BaseModal
        type="confirmation"
        className="add-question-confirmation-modal"
        closable={true}
        renderContent={this.renderContent}
        onClose={this.props.onClose}
      />
    );
  }

  renderContent = () => {
    return (
      <div className="add-question-confirmation-modal">
        <p>
          Jeszcze momencik… a Twoje pytanie pojawi się na liście dostępnych pytań. Najpierw musimy rzucić na nie okiem i
          zatwierdzić.
          <br /> W międzyczasie zajrzyj na nasze blogi ❤️
        </p>
        <div className="logos">
          <a href="http://angular.love/" target="_blank" title="Angular.love">
            <img src="/static/images/angular_love_logo.png" alt="Angular.love" />
          </a>

          <a href="https://typeofweb.com/" target="_blank" title="Type of Web">
            <img src="/static/images/type_of_web_logo.png" alt="Type of Web" />
          </a>
        </div>
        <button className="round-button alternative-button" onClick={this.close}>
          OK!
        </button>
      </div>
    );
  };

  close: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    this.props.onClose({ event: e });
  };
}
