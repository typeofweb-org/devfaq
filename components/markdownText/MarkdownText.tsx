import * as React from 'react';

import * as commonmark from 'commonmark';
import * as Prism from 'prismjs';
import './markdownText.scss';
import * as xss from 'xss';

type MarkdownTextProps = { className?: string; value: string };

const reader = new commonmark.Parser();
const writer = new commonmark.HtmlRenderer();

export function getHtmlFromMarkdown(markdown: string): string {
  const parsed = reader.parse(
    xss(markdown, {
      whiteList: {},
      stripIgnoreTag: true,
      stripIgnoreTagBody: ['script'],
    })
  );
  return writer.render(parsed);
}

export function highlightSyntax(el: Element): void {
  Prism.highlightAllUnder(el);
}

export default class MarkdownText extends React.Component<MarkdownTextProps> {
  markdownRef = React.createRef<HTMLDivElement>();

  getHtmlFromMarkdown(markdown: string): string {
    return getHtmlFromMarkdown(markdown);
  }

  shouldComponentUpdate(nextProps: MarkdownTextProps): boolean {
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
    if (typeof window === 'undefined') {
      return;
    }

    highlightSyntax(this.markdownRef.current);
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
