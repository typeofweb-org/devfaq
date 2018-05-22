import * as React from 'react';

import * as commonmark from 'commonmark';
import * as Prism from 'prismjs';
import './markdownText.scss';

type MarkdownTextProps = { className?: string; value: string };

export class MarkdownRenderer {
  private static instance: MarkdownRenderer;
  static getInstance(): MarkdownRenderer {
    if (!MarkdownRenderer.instance) {
      MarkdownRenderer.instance = new MarkdownRenderer();
    }

    return MarkdownRenderer.instance;
  }

  private reader = new commonmark.Parser();
  private writer = new commonmark.HtmlRenderer();

  getHtmlFromMarkdown(markdown: string): string {
    const parsed = this.reader.parse(markdown);
    return this.writer.render(parsed);
  }

  highlightSyntax(el: Element): void {
    Prism.highlightAllUnder(el);
  }

  /**
   * @deprecated @see MarkdownRenderer#getInstance
   */
  private constructor() {}
}

export default class MarkdownText extends React.Component<MarkdownTextProps> {
  markdownRef = React.createRef<HTMLDivElement>();

  getHtmlFromMarkdown(markdown: string): string {
    return MarkdownRenderer.getInstance().getHtmlFromMarkdown(markdown);
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

    MarkdownRenderer.getInstance().highlightSyntax(this.markdownRef.current);
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
