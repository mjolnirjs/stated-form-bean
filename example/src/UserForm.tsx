import { useBean } from 'stated-bean';

import { UserModel } from './UserModel';

import * as React from 'react';

export const UserForm = () => {
  const model = useBean(UserModel);

  console.log(model);
  const { errors } = model.getFormField('user');

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    const valid = await model.validate('user');
    if (valid) {
      console.info('valid success');
    }
  };
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
          Submit
        </button>
      </form>
    </div>
  );
};
