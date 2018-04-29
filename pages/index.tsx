import * as React from 'react';
import { Http2ServerRequest } from 'http2';
import '../styles/index.scss';

type IndexProps = {};
type IndexState = {};

export default class Index extends React.Component<IndexProps, IndexState> {
  static async getInitialProps({ req }: { req: Http2ServerRequest }) {
    return {};
  }

  render() {
    return <div>Hello, world!</div>;
  }
}
