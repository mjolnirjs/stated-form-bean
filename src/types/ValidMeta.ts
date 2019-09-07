import { Schema } from 'yup';

export interface ValidOption {
  validOnChange?: boolean;
}

export interface FieldMeta<T> {
  schema: Schema<T>;
  option: ValidOption;
}

export interface ValidMeta<T> {
  target: Function;
  fields: Map<keyof T, FieldMeta<T[keyof T]>>;
}
