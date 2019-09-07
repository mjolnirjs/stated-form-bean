import { getMetadataStorage } from '../metadata';
import { ValidOption } from '../types';

import { Schema } from 'yup';

export function Valid(
  schema: Schema<unknown>,
  option: ValidOption = { validOnChange: true },
): PropertyDecorator {
  return (target, propertyKey) => {
    getMetadataStorage().collectField<any>({
      target: target.constructor,
      field: propertyKey as any,
      schema,
      validOption: option,
    });
  };
}
