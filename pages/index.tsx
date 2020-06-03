import React from 'react';
import { GetInitialPropsContext } from '../utils/types';
import { redirect } from '../utils/redirect';

const Index = () => null;

Index.getInitialProps = async (ctx: GetInitialPropsContext) => {
  return redirect('/questions/[technology]', { technology: 'js', page: '1' }, ctx);
};

export default Index;
