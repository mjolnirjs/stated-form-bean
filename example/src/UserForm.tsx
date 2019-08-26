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
