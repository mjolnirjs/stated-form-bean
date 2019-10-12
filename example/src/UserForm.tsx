/* eslint-disable @typescript-eslint/unbound-method */
import { useBean } from 'stated-bean';

import { UserModel } from './UserModel';

import * as React from 'react';
import { useFormBean } from 'stated-form-bean';

export const UserForm = () => {
  const model = useBean(UserModel);
  const { values, errors, setFieldValue } = useFormBean(model.formBean);

  console.log(errors);

  return (
    <div>
      <form>
        <div>
          <label>UserName:</label>
          <input
            type="text"
            value={values.name || ''}
            onChange={e =>
              setFieldValue<string>('name', e.target.value, true).subscribe(v =>
                console.log('name', v),
              )
            }
          />
          <span>{errors.name}</span>
        </div>
        <div>
          <label>Age:</label>
          <input
            type="number"
            min={10}
            max={99}
            value={values.age}
            onChange={e => setFieldValue('age', Number(e.target.value))}
          />
          <span>{errors.age}</span>
        </div>
        <button type="button" onClick={model.submit}>
          Submit
        </button>
      </form>
    </div>
  );
};
