import { FormError, FormTouched } from '../types';

import * as yup from 'yup';
import get from 'lodash.get';
import set from 'lodash.set';

export class FormField<Values> {
  private _errors: FormError<Values> = {};

  private _touched: { [K in keyof Values]?: FormTouched<Values[K]> } = {};

  constructor(
    public readonly field: string | symbol,
    private readonly _schema?: yup.Schema<Values>,
  ) {
    this.field = field;
    this._schema = _schema;
  }

  get errors() {
    return this._errors;
  }

  get touched() {
    return this._touched;
  }

  validate(data: Values, schema?: yup.Schema<Values>): Promise<boolean> {
    const yupSchema = schema || this._schema;
    if (yupSchema === undefined) {
      throw new Error('miss yup schema for ' + String(this.field));
    }
    return yupSchema
      .validate(data, {
        abortEarly: false,
      })
      .then(() => {
        this._clearErrors();
        return true;
      })
      .catch(err => {
        this._addError(err);
        return false;
      });
  }

  _clearErrors() {
    this._errors = {};
  }

  hasError(path?: keyof Values): boolean {
    if (path === undefined) {
      return Object.keys(this._errors).length > 0;
    }
    return get(this._errors, path) !== undefined;
  }

  getError(path: keyof Values) {
    return get(this._errors, path);
  }

  hasTouched(path: keyof Values): boolean {
    return get(this._touched, path) !== undefined;
  }

  setTouched(touched: FormTouched<Values>) {
    this._touched = {
      ...this._touched,
      ...touched,
    };
  }

  _addError(error: yup.ValidationError) {
    if (error.inner) {
      if (error.inner.length === 0) {
        this._errors = set(this._errors, error.path, error.message);
      }
      for (const err of error.inner) {
        if (!(this._errors as any)[err.path]) {
          this._errors = set(this._errors, err.path, err.message);
        }
      }
    }
  }
}
