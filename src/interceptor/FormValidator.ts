import { NextCaller, EffectEvent, StateChanged } from 'stated-bean';

import { getMetadataStorage } from '../metadata';
import { FormModel } from '../core/FormModel';

export const FormValidator = async (event: EffectEvent, next: NextCaller) => {
  await next();

  const bean = event.target;
  const { fieldMeta } = event.value as StateChanged<unknown>;
  const { target, name } = fieldMeta;
  const validFieldMeta = getMetadataStorage().getField<any>(target, name);
  if (validFieldMeta !== undefined && bean instanceof FormModel) {
    if (validFieldMeta.option.validOnChange) {
      bean.validate(name);
    }
  }
};
