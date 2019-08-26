# stated-form-bean

[![Travis](https://img.shields.io/travis/com/mjolnirjs/stated-form-bean.svg)](https://travis-ci.com/mjolnirjs/stated-form-bean)
[![Codecov](https://img.shields.io/codecov/c/gh/mjolnirjs/stated-form-bean)](https://codecov.io/gh/mjolnirjs/stated-form-bean)
[![type-coverage](https://img.shields.io/badge/dynamic/json.svg?label=type-coverage&prefix=%E2%89%A5&suffix=%&query=$.typeCoverage.atLeast&uri=https%3A%2F%2Fraw.githubusercontent.com%2Fmjolnirjs%2Fstated-form-bean%2Fmaster%2Fpackage.json)](https://github.com/plantain-00/type-coverage)
[![npm](https://img.shields.io/npm/v/stated-form-bean.svg)](https://www.npmjs.com/package/stated-form-bean)
[![GitHub release](https://img.shields.io/github/release/mjolnirjs/stated-form-bean)](https://github.com/mjolnirjs/stated-form-bean/releases)

[![David Peer](https://img.shields.io/david/peer/mjolnirjs/stated-form-bean.svg)](https://david-dm.org/mjolnirjs/stated-form-bean?type=peer)
[![David](https://img.shields.io/david/mjolnirjs/stated-form-bean.svg)](https://david-dm.org/mjolnirjs/stated-form-bean)
[![David Dev](https://img.shields.io/david/dev/mjolnirjs/stated-form-bean.svg)](https://david-dm.org/mjolnirjs/stated-form-bean?type=dev)

[![Conventional Commits](https://img.shields.io/badge/conventional%20commits-1.0.0-yellow.svg)](https://conventionalcommits.org)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![codechecks.io](https://raw.githubusercontent.com/codechecks/docs/master/images/badges/badge-default.svg?sanitize=true)](https://codechecks.io)

## Install

```sh
# yarn
yarn add stated-bean yup stated-form-bean

yarn add @types/yup -D

# npm
npm i stated-bean yup stated-form-bean

npm i @types/yup -D
```

## Usage

<details open>
<summary><b>FormModel</b></summary>

```ts
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
    { validOnChange: false },
  )
  user: Partial<User> = { age: 15 };

  setUser(u: Partial<User>) {
    this.user = {
      ...this.user,
      ...u,
    };
  }
}
```

</details>

<details open>
<summary><b>React Form</b></summary>

```tsx
import { useStatedBean } from 'stated-bean';

import { UserModel } from './UserModel';

import * as React from 'react';

export const UserForm = () => {
  const model = useStatedBean(UserModel);

  const { errors } = model.getFormField('user');

  const handleSubmit = React.useCallback(
    async e => {
      e.preventDefault();
      console.log(model);
      const valid = await model.validate('user');
      if (valid) {
        alert('valid success');
      }
    },
    [model],
  );
  return (
    <div>
      <form>
        <div>
          <label>UserName:</label>
          <input
            type="text"
            value={model.user.name || ''}
            onChange={e => model.setUser({ name: e.target.value })}
          />
          <span>{errors && errors.name}</span>
        </div>
        <div>
          <label>Age:</label>
          <input
            type="number"
            min={10}
            max={99}
            value={model.user.age}
            onChange={e => model.setUser({ age: Number(e.target.value) })}
          />
          <span>{errors && errors.age}</span>
        </div>
        <button type="submit" onClick={handleSubmit}>
          提交
        </button>
      </form>
    </div>
  );
};
```

</details>

<details open>
<summary><b>FormValidatorInterceptor</b></summary>

```tsx
const app = new StatedBeanApplication();

app.setInterceptors(new FormValidateInterceptor());

const App = () => {
  return (
    <StatedBeanProvider application={app} types={[]}>
      <UserForm />
    </StatedBeanProvider>
  );
};
```

</details>

## License

[MIT](http://opensource.org/licenses/MIT)
