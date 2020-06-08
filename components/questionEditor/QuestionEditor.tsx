import classNames from 'classnames';
import React, { useRef, useState, memo, useCallback, useLayoutEffect } from 'react';

import { getHtmlFromMarkdown, highlightSyntax } from '../markdownText/MarkdownText';

import styles from './questionEditor.module.scss';

interface QuestionEditorProps {
  id?: string;
  label?: string;
  value: string;
  onChange(text: string): any;
}

const actions = {
  BOLD: { open: '**', close: '**' },
  ITALIC: { open: '_', close: '_' },
  HEADING: { open: '# ', close: '' },
  CODEBLOCK: { open: '```javascript\n', close: '\n```' },
  UL: { open: '* ', close: '' },
  OL: { open: '1. ', close: '' },
} as const;
type Actions = keyof typeof actions;

const autoresize = (el: HTMLTextAreaElement) => {
  el.style.height = 'auto';
  el.style.height = el.scrollHeight + 'px';
  el.scrollTop = el.scrollHeight;
  window.scrollTo(window.scrollX, el.scrollTop + el.scrollHeight);
};

const autofocus = (
  el: HTMLTextAreaElement,
  selectionStart = el.selectionStart,
  selectionEnd = el.selectionEnd
) => {
  el.focus();
  el.setSelectionRange(selectionStart, selectionEnd);
};

const addTokensToTextarea = (
  el: HTMLTextAreaElement,
  tokens: typeof actions[keyof typeof actions],
  onChange: QuestionEditorProps['onChange']
): void => {
  const { selectionStart, selectionEnd, value } = el;
  const { open, close } = tokens;

  let newValue = value;
  newValue = newValue.substring(0, selectionEnd) + close + newValue.substr(selectionEnd);
  newValue = newValue.substring(0, selectionStart) + open + newValue.substr(selectionStart);

  onChange(newValue);
  el.value = newValue;
  autofocus(el, selectionStart + open.length, selectionEnd + open.length);
};

export const QuestionEditor = memo<QuestionEditorProps>(({ onChange, value }) => {
  const [isPreview, setIsPreview] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef({ selectionStart: 0, selectionEnd: 0 });

  const handleTextChange = useCallback(() => {
    if (!textAreaRef.current) {
      return;
    }
    onChange(textAreaRef.current.value || '');
  }, [onChange]);

  const handleAction = useCallback(
    (action: Actions): React.MouseEventHandler<HTMLButtonElement> => (e) => {
      e.preventDefault();

      const el = textAreaRef.current;
      if (!el) {
        return;
      }

      const tokens = actions[action];
      addTokensToTextarea(el, tokens, onChange);
      handleTextChange();
    },
    [handleTextChange, onChange]
  );

  const togglePreview: React.MouseEventHandler<HTMLButtonElement> = useCallback((e) => {
    e.preventDefault();
    if (textAreaRef.current) {
      cursorRef.current = {
        selectionStart: textAreaRef.current.selectionStart,
        selectionEnd: textAreaRef.current.selectionEnd,
      };
    }
    setIsPreview((isPreview) => !isPreview);
  }, []);

  const handleEditorClick = useCallback(() => {
    if (!textAreaRef.current) {
      return;
    }
    // clicking anywhere in the editor should focus the textarea
    autofocus(textAreaRef.current);
  }, []);

  useLayoutEffect(() => {
    if (isPreview && previewRef.current) {
      highlightSyntax(previewRef.current);
    }
    if (!isPreview && textAreaRef.current) {
      // restore previous cursor position
      autofocus(
        textAreaRef.current,
        cursorRef.current.selectionStart,
        cursorRef.current.selectionEnd
      );
    }
  }, [isPreview]);

  useLayoutEffect(() => {
    if (!isPreview && textAreaRef.current) {
      autoresize(textAreaRef.current);
    }
  }, [value, isPreview]);

  return (
    <div className={styles.markdownEditorContainer}>
      <div className={styles.markdownEditorToolbar}>
        <button
          className="devicon-bold"
          disabled={isPreview}
          onClick={handleAction('BOLD')}
          aria-label="wstaw pogrubienie"
          title="wstaw pogrubienie"
        />
        <button
          className="devicon-italic"
          disabled={isPreview}
          onClick={handleAction('ITALIC')}
          aria-label="wstaw italik"
          title="wstaw italik"
        />
        <button
          className="devicon-header"
          disabled={isPreview}
          onClick={handleAction('HEADING')}
          aria-label="wstaw nagłówek"
          title="wstaw nagłówek"
        />
        <span className={styles.separator}>|</span>
        <button
          className="devicon-code"
          disabled={isPreview}
          onClick={handleAction('CODEBLOCK')}
          aria-label="wstaw blok kodu"
          title="wstaw blok kodu"
        />
        <button
          className="devicon-list-ul"
          disabled={isPreview}
          onClick={handleAction('UL')}
          aria-label="wstaw listę nieuporządkowaną"
          title="wstaw listę nieuporządkowaną"
        />
        <button
          className="devicon-list-ol"
          disabled={isPreview}
          onClick={handleAction('OL')}
          aria-label="wstaw listę uporządkowaną"
          title="wstaw listę uporządkowaną"
        />
        <span className={styles.separator}>|</span>
        <button
          className="devicon-eye"
          onClick={togglePreview}
          aria-hidden={true}
          title="zobacz podgląd"
        />
      </div>
      <div
        className={classNames(styles.markdownEditorContent, {
          [styles.markdownEditorContentPreview]: isPreview,
        })}
        onClick={handleEditorClick}
      >
        {!isPreview && (
          <textarea
            className={styles.markdownEditorField}
            ref={textAreaRef}
            value={value}
            onChange={handleTextChange}
          />
        )}
        {isPreview && (
          <div
            className={styles.markdownEditorPreview}
            ref={previewRef}
            dangerouslySetInnerHTML={{ __html: getHtmlFromMarkdown(value) }}
          />
        )}
      </div>
    </div>
  );
});
