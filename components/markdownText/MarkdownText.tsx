import React from 'react';
import commonmark from 'commonmark';
import xss from 'xss';

interface MarkdownTextProps {
  className?: string;
  value: string;
}

const reader = new commonmark.Parser();
const writer = new commonmark.HtmlRenderer();

export function getHtmlFromMarkdown(markdown: string): string {
  const parsed = reader.parse(markdown);
  const rendered = writer.render(parsed);
  return xss.filterXSS(rendered, {
    onIgnoreTagAttr(tag, name, value, _isWhiteAttr) {
      if (tag !== 'code' && tag !== 'pre') {
        return;
      }
      if (name !== 'class') {
        return;
      }
      return `${name}="${xss.escapeAttrValue(value)}"`;
    },
  });
}

export function highlightSyntax(el: Element): void {
  import('prismjs')
    .then(Prism => {
      Prism.highlightAllUnder(el);
    })
    .catch(err => {
      console.error(err);
    });
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
