import { StatedBeanApplication, StatedBeanProvider } from 'stated-bean';

import { UserForm } from './src/UserForm';

import React from 'react';
import ReactDOM from 'react-dom';

const app = new StatedBeanApplication();

const App = () => {
  return (
    <StatedBeanProvider application={app}>
      <UserForm />
    </StatedBeanProvider>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
