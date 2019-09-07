import { StatedBean, Stated } from 'stated-bean';
import { Valid, FormModel } from 'stated-form-bean';

import * as yup from 'yup';

export interface User {
  name: string;
  age: number;
}

@StatedBean()
export class UserModel extends FormModel<UserModel> {
  @Stated()
  @Valid(
    yup.object().shape({
      name: yup.string().required(),
      age: yup
        .number()
        .min(10)
        .max(99)
        .required(),
    }),
    // { validOnChange: false },
  )
  user: Partial<User> = { age: 15 };

  setUser(u: Partial<User>) {
    this.user = {
      ...this.user,
      ...u,
    };
  }
}
