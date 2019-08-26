import { ValidMeta, ValidOption, FieldMeta } from '../types';

import { Schema } from 'yup';

export class ValidMetaStorage {
  private readonly _types: WeakMap<Function, ValidMeta>;

  constructor() {
    this._types = new WeakMap();
  }

  collectField(meta: {
    target: Function;
    field: string | symbol;
    schema: Schema<unknown>;
    validOption: ValidOption;
  }) {
    const fieldMeta = {
      schema: meta.schema,
      option: meta.validOption,
    };
    const validMeta = this._types.get(meta.target);
    if (validMeta !== undefined) {
      validMeta.fields.set(meta.field, fieldMeta);
    } else {
      const fields = new Map();
      fields.set(meta.field, fieldMeta);
      this._types.set(meta.target, {
        target: meta.target,
        fields,
      });
    }
  }

  getField(type: Function, field: string | symbol): FieldMeta | undefined {
    const meta = this._types.get(type);
    if (meta !== undefined) {
      return meta.fields.get(field);
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
