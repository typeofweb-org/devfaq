import React from 'react';
import { redirect } from '../utils/redirect';
import { GetInitialPropsContext } from '../utils/types';

export default class QuestionsPage extends React.PureComponent {
  static async getInitialProps(ctx: GetInitialPropsContext) {
    return redirect('/questions/[technology]', { technology: 'js', page: '1' }, ctx);
  }

  render() {
    return null;
  }
}
