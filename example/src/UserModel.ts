/* eslint-disable @typescript-eslint/no-magic-numbers */
import { Stated, StatedBean } from 'stated-bean';
import * as yup from 'yup';

import { FormBean } from 'stated-form-bean';

export interface User {
  name: string;
  age: number;
  hobby: string[];
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
  hobby: yup
    .array()
    .of(yup.string().required())
    .required(),
});

@StatedBean()
export class UserModel {
  @Stated()
  formBean = new FormBean<User>({
    initialValues: { age: 15, name: '', hobby: [] },
    schema: valid,
    validOnChange: true,
  });

  submit() {
    this.formBean.validate().subscribe({
      next: values => {
        console.log(values);
      },
      error: err => {
        console.error(err);
      },
    });
  }
}
