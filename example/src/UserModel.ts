/* eslint-disable @typescript-eslint/no-magic-numbers */
import { Stated, StatedBean } from 'stated-bean';

import { FormBean } from 'stated-form-bean';
import * as yup from 'yup';

export interface User {
  name: string;
  age: number;
}

const valid = yup.object().shape({
  name: yup
    .string()
    .ensure()
    .required(),
  age: yup
    .number()
    .min(10)
    .max(99)
    .required(),
});

@StatedBean()
export class UserModel {
  @Stated()
  formBean = new FormBean<User>({
    initialValues: { age: 15, name: '' },
    schema: valid,
    validOnChange: true,
  });

  submit() {
    this.formBean.isValid().subscribe({
      next: values => {
        console.log(values);
      },
      error: err => {
        console.error(err);
      },
    });
  }
}
