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
    this[fields][field] = new FormField(schema);
  }

  getFormField<T extends keyof Values>(field: T): FormField<Values[T]> {
    return this[fields][field];
  }

  validate<T extends keyof Values>(field: T): Promise<boolean> {
    const formField = this[fields][field];

    const newLocal = (this as any) as Values;
    return formField.validate(newLocal[field]).then(valid => {
      if (Object.prototype.hasOwnProperty.call(newLocal, ForceUpdate)) {
        (newLocal as any)[ForceUpdate](field);
      }
      return valid;
    });
  }

  [_clearErrors](field: keyof Values & (string | symbol)) {
    if (this[fields] !== undefined && this[fields][field] !== undefined) {
      this[fields][field]._clearErrors();
    }
  }

  [_addError](
    field: keyof Values & (string | symbol),
    error: yup.ValidationError,
  ) {
    const formField = this.getFormField(field);

    formField._addError(error);
  }
}
