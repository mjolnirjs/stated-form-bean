import { ForceUpdate } from 'stated-bean';

import { FormField } from './FormField';

import * as yup from 'yup';

export const fields = Symbol('stated_form_bean_fields');

export const _clearErrors = Symbol('stated_form_bean_clearErrors');
export const _addError = Symbol('stated_form_bean_addError');

export class FormModel<Values> {
  private readonly [fields]: {
    [K in keyof Values]: FormField<Values[K]>;
  } = {} as { [K in keyof Values]: FormField<Values[K]> };

  setFormField<T extends keyof Values>(
    field: T,
    schema: yup.Schema<Values[T]>,
  ): void {
    this[fields][field] = new FormField(field as (string | symbol), schema);
  }

  getFormField<T extends keyof Values>(field: T): FormField<Values[T]> {
    return this[fields][field];
  }

  validate<T extends keyof Values>(
    this: FormModel<Values> &
      Values & {
        [ForceUpdate]: (field: T) => void;
      },
    field: T,
    schema?: yup.Schema<Values[T]>,
  ): Promise<boolean> {
    if (this[fields][field] === undefined) {
      this[fields][field] = new FormField(field as (string | symbol), schema);
    }
    const formField = this[fields][field];

    const self = this;
    return formField.validate(self[field], schema).then(valid => {
      if (Object.prototype.hasOwnProperty.call(self, ForceUpdate)) {
        self[ForceUpdate](field);
      }
      return valid;
    });
  }

  [_clearErrors](field: keyof Values) {
    if (this[fields] !== undefined && this[fields][field] !== undefined) {
      this[fields][field]._clearErrors();
    }
  }

  [_addError](field: keyof Values, error: yup.ValidationError) {
    const formField = this.getFormField(field);

    formField._addError(error);
  }
}
