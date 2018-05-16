import * as React from 'react';

import * as commonmark from 'commonmark';
import * as Prism from 'prismjs';
import './markdownText.scss';

type Props = { className?: string; value: string };

export default class MarkdownText extends React.Component<Props> {
  private reader = new commonmark.Parser();
  private writer = new commonmark.HtmlRenderer();

  markdownRef = React.createRef<HTMLDivElement>();

  getHtmlFromMarkdown(markdown: string): string {
    const parsed = this.reader.parse(markdown);
    return this.writer.render(parsed);
  }

  shouldComponentUpdate(nextProps: Props): boolean {
    return this.props.value !== nextProps.value;
  }

  componentDidMount() {
    this.highlight();
  }

  componentDidUpdate() {
    this.highlight();
  }

  highlight() {
    if (!this.markdownRef.current) {
      return;
    }

    Prism.highlightAllUnder(this.markdownRef.current);
  }

  render() {
    return (
      <div
        className={this.props.className}
        ref={this.markdownRef}
        dangerouslySetInnerHTML={{ __html: this.getHtmlFromMarkdown(this.props.value) }}
      />
    );
  }
}
