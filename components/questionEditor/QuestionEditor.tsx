// import { getHtmlFromMarkdown, highlightSyntax } from '../markdownText/MarkdownText';
import * as React from 'react';
import './questionEditor.scss';

type QuestionEditorProps = {
  id?: string;
  label?: string;
  onChange(text: string): any;
  value: string;
};

type QuestionEditorState = {};

export default class QuestionEditor extends React.Component<QuestionEditorProps, QuestionEditorState> {
  state = {};

  handleChange: React.ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    this.props.onChange(e.currentTarget.value || '');
  };

  render() {
    return (
      <div className="markdown-editor-container">
        <textarea value={this.props.value} onChange={this.handleChange} />
      </div>
    );
  }
}
