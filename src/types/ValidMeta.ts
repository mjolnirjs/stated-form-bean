import { Schema } from 'yup';

export interface ValidOption {
  validOnChange?: boolean;
}

export interface FieldMeta {
  schema: Schema<unknown>;
  option: ValidOption;
}

export interface ValidMeta {
  target: Function;
  fields: Map<string | symbol, FieldMeta>;
}
