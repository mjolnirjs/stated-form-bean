import { StatedBeanType, StatedBeanSymbol } from 'stated-bean';

import { getMetadataStorage } from '../metadata';

import { FormField } from './FormField';

import * as yup from 'yup';

export const _fields = Symbol('stated_form_bean_fields');
export const _clearErrors = Symbol('stated_form_bean_clearErrors');
export const _addError = Symbol('stated_form_bean_addError');

export class FormModel<Values> {
  private readonly [_fields]: {
    [K in keyof Values]: FormField<Values[K]>;
  } = {} as { [K in keyof Values]: FormField<Values[K]> };

  setFormField<T extends keyof Values>(
    field: T,
    schema: yup.Schema<Values[T]>,
  ): void {
    const formField = this[_fields][field];
    if (formField !== undefined) {
      formField.setSchema(schema);
    } else {
      this[_fields][field] = new FormField(field as (string | symbol), schema);
    }
  }

  getFormField<T extends keyof Values>(field: T): FormField<Values[T]> {
    if (this[_fields][field] === undefined) {
      const validFieldMeta = getMetadataStorage().getField<Values>(
        Object.getPrototypeOf(this).constructor,
        field,
      );
      if (validFieldMeta !== undefined) {
        this[_fields][field] = new FormField(
          field as (string | symbol),
          validFieldMeta.schema as yup.Schema<Values[T]>,
        );
      }
    }
    return this[_fields][field];
  }

  validate<T extends keyof Values>(
    this: FormModel<Values> & Values,
    field: T,
    schema?: yup.Schema<Values[T]>,
  ): Promise<boolean> {
    console.log(this[_fields]);
    if (this[_fields][field] === undefined) {
      let validSchema = schema;
      if (schema === undefined) {
        console.log(Object.getPrototypeOf(this).constructor, field);
        const validFieldMeta = getMetadataStorage().getField<Values>(
          Object.getPrototypeOf(this).constructor,
          field,
        );
        validSchema =
          validFieldMeta !== undefined
            ? (validFieldMeta.schema as yup.Schema<Values[T]>)
            : undefined;
      }
      this[_fields][field] = new FormField(
        field as (string | symbol),
        validSchema,
      );
    }
    const formField = this[_fields][field];

    return formField.validate(this[field], schema).then(valid => {
      const bean = (this as unknown) as StatedBeanType<Values>;
      if (bean[StatedBeanSymbol] !== undefined) {
        bean[StatedBeanSymbol].forceUpdate(field);
      }
      return valid;
    });
  }

  [_clearErrors](field: keyof Values) {
    if (this[_fields] !== undefined && this[_fields][field] !== undefined) {
      this[_fields][field]._clearErrors();
    }
  }

  [_addError](field: keyof Values, error: yup.ValidationError) {
    const formField = this.getFormField(field);

    formField._addError(error);
  }
}
