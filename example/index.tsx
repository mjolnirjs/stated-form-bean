import { StatedBeanApplication, StatedBeanProvider } from 'stated-bean';
import { FormValidator } from 'stated-form-bean';

import { UserForm } from './src/UserForm';

import ReactDOM from 'react-dom';
import React from 'react';

const app = new StatedBeanApplication();

app.use(FormValidator);

const App = () => {
  return (
    <StatedBeanProvider application={app} types={[]}>
      <UserForm />
    </StatedBeanProvider>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
