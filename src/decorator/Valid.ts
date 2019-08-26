import { getMetadataStorage } from '../metadata';
import { ValidOption } from '../types';

import { Schema } from 'yup';

export function Valid<T>(
  schema: Schema<T>,
  option: ValidOption = { validOnChange: true },
): PropertyDecorator {
  return (target, propertyKey) => {
    getMetadataStorage().collectField({
      target: target.constructor,
      field: propertyKey,
      schema,
      validOption: option,
    });
  };
}
