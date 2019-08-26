import { StatedBeanApplication, StatedBeanProvider } from 'stated-bean';

import { UserForm } from './src/UserForm';

import ReactDOM from 'react-dom';
import React from 'react';
import { FormValidateInterceptor } from 'stated-form-bean';

const app = new StatedBeanApplication();

app.setInterceptors(new FormValidateInterceptor());

const App = () => {
  return (
    <StatedBeanProvider application={app} types={[]}>
      <UserForm />
    </StatedBeanProvider>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
