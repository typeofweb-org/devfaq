import { MarkdownRenderer } from '../markdownText/MarkdownText';
import * as React from 'react';

import * as SimpleMDE from 'react-simplemde-editor';

type QuestionEditorProps = {
  id?: string;
  label?: string;
  onChange?(text: string): any;
  value?: string;
};

export default class QuestionEditor extends React.Component<QuestionEditorProps> {
  render() {
    return (
      <SimpleMDE
        id={this.props.id}
        label={this.props.label}
        onChange={this.props.onChange}
        value={this.props.value}
        options={{
          spellChecker: false,
          status: false,
          toolbar: ['bold', 'italic', 'heading', '|', 'code', 'unordered-list', 'ordered-list', '|', 'preview'],
          shortcuts: {
            toggleBlockquote: '',
            toggleBold: '',
            cleanBlock: '',
            toggleHeadingSmaller: '',
            toggleItalic: '',
            drawLink: '',
            toggleUnorderedList: '',
            togglePreview: '',
            toggleCodeBlock: '',
            drawImage: '',
            toggleOrderedList: '',
            toggleHeadingBigger: '',
            toggleSideBySide: '',
            toggleFullScreen: '',
          },
          previewRender: (plainText, previewEl) => {
            if (!previewEl || !window) {
              return plainText;
            }
            const markdownPreview = MarkdownRenderer.getInstance().getHtmlFromMarkdown(plainText);
            setTimeout(() => MarkdownRenderer.getInstance().highlightSyntax(previewEl), 0);
            return markdownPreview;
          },
        }}
      />
    );
  }
}
