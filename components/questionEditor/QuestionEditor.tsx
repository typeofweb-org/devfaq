import classNames from 'classnames';
import React from 'react';

import { getHtmlFromMarkdown, highlightSyntax } from '../markdownText/MarkdownText';

import styles from './questionEditor.module.scss';

interface QuestionEditorProps {
  id?: string;
  label?: string;
  value: string;
  onChange(text: string): any;
}

interface QuestionEditorState {
  isPreview: boolean;
}

type Actions = 'BOLD' | 'ITALIC' | 'HEADING' | 'CODEBLOCK' | 'UL' | 'OL';
interface Tokens {
  open: string;
  close: string;
}

export default class QuestionEditor extends React.Component<
  QuestionEditorProps,
  QuestionEditorState
> {
  state = { isPreview: false };
  textAreaRef = React.createRef<HTMLTextAreaElement>();
  previewRef = React.createRef<HTMLDivElement>();

  actionToTokens: { [action in Actions]: Tokens } = {
    BOLD: { open: '**', close: '**' },
    ITALIC: { open: '_', close: '_' },
    HEADING: { open: '# ', close: '' },
    CODEBLOCK: { open: '```javascript\n', close: '\n```' },
    UL: { open: '* ', close: '' },
    OL: { open: '1. ', close: '' },
  };

  handleTextChange = () => {
    if (!this.textAreaRef.current) {
      return;
    }
    this.props.onChange(this.textAreaRef.current.value || '');
    this.autoresize();
  };

  autoresize = () => {
    const el = this.textAreaRef.current;
    if (!el) {
      return;
    }

    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
    el.scrollTop = el.scrollHeight;
    window.scrollTo(window.scrollX, el.scrollTop + el.scrollHeight);
  };

  autoFocus = () => {
    const el = this.textAreaRef.current;
    if (!el) {
      return;
    }

    el.focus();
  };

  addTokensToTextarea = (el: HTMLTextAreaElement, tokens: Tokens): void => {
    const { selectionStart, selectionEnd, value } = el;
    const startTokenLenths = tokens.open.length;

    let newValue = value;
    newValue = newValue.substring(0, selectionEnd) + tokens.close + newValue.substr(selectionEnd);
    newValue =
      newValue.substring(0, selectionStart) + tokens.open + newValue.substr(selectionStart);

    this.props.onChange(newValue);
    el.value = newValue;
    this.autoFocus();
    el.setSelectionRange(selectionStart + startTokenLenths, selectionEnd + startTokenLenths);
  };

  handleAction = (action: Actions): React.MouseEventHandler<HTMLButtonElement> => (e) => {
    e.preventDefault();

    const el = this.textAreaRef.current;
    if (!el) {
      return;
    }

    const tokens = this.actionToTokens[action];

    this.addTokensToTextarea(el, tokens);
    this.handleTextChange();
  };

  togglePreview: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    this.setState(
      (state) => ({ isPreview: !state.isPreview }),
      () => {
        if (this.previewRef.current) {
          highlightSyntax(this.previewRef.current);
        } else {
          this.autoresize();
        }
      }
    );
  };

  render() {
    const { isPreview } = this.state;
    return (
      <div className={styles.markdownEditorContainer}>
        <div className={styles.markdownEditorToolbar}>
          <button
            className="devicon-bold"
            disabled={isPreview}
            onClick={this.handleAction('BOLD')}
            aria-label="wstaw pogrubienie"
            title="wstaw pogrubienie"
          />
          <button
            className="devicon-italic"
            disabled={isPreview}
            onClick={this.handleAction('ITALIC')}
            aria-label="wstaw italik"
            title="wstaw italik"
          />
          <button
            className="devicon-header"
            disabled={isPreview}
            onClick={this.handleAction('HEADING')}
            aria-label="wstaw nagłówek"
            title="wstaw nagłówek"
          />
          <span className={styles.separator}>|</span>
          <button
            className="devicon-code"
            disabled={isPreview}
            onClick={this.handleAction('CODEBLOCK')}
            aria-label="wstaw blok kodu"
            title="wstaw blok kodu"
          />
          <button
            className="devicon-list-ul"
            disabled={isPreview}
            onClick={this.handleAction('UL')}
            aria-label="wstaw listę nieuporządkowaną"
            title="wstaw listę nieuporządkowaną"
          />
          <button
            className="devicon-list-ol"
            disabled={isPreview}
            onClick={this.handleAction('OL')}
            aria-label="wstaw listę uporządkowaną"
            title="wstaw listę uporządkowaną"
          />
          <span className={styles.separator}>|</span>
          <button
            className="devicon-eye"
            onClick={this.togglePreview}
            aria-hidden={true}
            title="zobacz podgląd"
          />
        </div>
        <div
          className={classNames(styles.markdownEditorContent, {
            [styles.markdownEditorContentPreview]: isPreview,
          })}
          onClick={this.autoFocus}
        >
          {!isPreview && (
            <textarea
              className={styles.markdownEditorField}
              ref={this.textAreaRef}
              value={this.props.value}
              onChange={this.handleTextChange}
            />
          )}
          {isPreview && (
            <div
              className={styles.markdownEditorPreview}
              ref={this.previewRef}
              dangerouslySetInnerHTML={{ __html: getHtmlFromMarkdown(this.props.value) }}
            />
          )}
        </div>
      </div>
    );
  }
}
