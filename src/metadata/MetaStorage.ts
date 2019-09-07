import { ValidMeta, ValidOption, FieldMeta } from '../types';

import { Schema } from 'yup';

export class ValidMetaStorage {
  private readonly _types: WeakMap<Function, ValidMeta<any>>;

  constructor() {
    this._types = new WeakMap();
  }

  collectField<T>(meta: {
    target: Function;
    field: keyof T & string;
    schema: Schema<T[keyof T]>;
    validOption: ValidOption;
  }) {
    const fieldMeta = {
      schema: meta.schema,
      option: meta.validOption,
    } as FieldMeta<T[keyof T]>;
    const validMeta = this._types.get(meta.target) as ValidMeta<T>;
    if (validMeta !== undefined) {
      validMeta.fields.set(meta.field, fieldMeta);
    } else {
      const fields = new Map<keyof T, FieldMeta<T[keyof T]>>();
      fields.set(meta.field, fieldMeta);
      this._types.set(meta.target, {
        target: meta.target,
        fields,
      });
    }
  }

  getField<T>(
    type: Function,
    field: keyof T,
  ): FieldMeta<T[keyof T]> | undefined {
    const meta = this._types.get(type);
    if (meta !== undefined) {
      return meta.fields.get(field) as FieldMeta<T[keyof T]>;
    }
    return undefined;
  }
}

let validMetaStorage: ValidMetaStorage | undefined;

export const getMetadataStorage = () => {
  if (validMetaStorage === undefined) {
    validMetaStorage = new ValidMetaStorage();
  }
  return validMetaStorage;
};
