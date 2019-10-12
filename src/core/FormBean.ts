import { BehaviorSubject, from, Observable, Subject, EMPTY } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { FormError, FormTouched } from '../types';

import set from 'set-value';
import * as yup from 'yup';

export interface FormBeanOptions<Values> {
  initialValues?: Values;
  schema?: yup.Schema<Values>;
  validOnChange?: boolean;
}

export interface FormState<Values> {
  values: Values;
  errors: FormError<Values>;
  touched: FormTouched<Values>;
}

type Action =
  | 'SET_VALUES'
  | 'SET_ERRORS'
  | 'SET_TOUCHED'
  | 'RESET_VALUES'
  | 'SET_FIELD_VALUE';

interface FormField<T> {
  field: keyof T;
  value: T[keyof T];
}

interface FormAction<T> {
  action: Action;
  payload:
    | Partial<T>
    | FormTouched<T>
    | FormError<T>
    | FormField<T>
    | undefined;
}

export class FormBean<T> extends BehaviorSubject<FormState<T>> {
  private readonly _options: FormBeanOptions<T>;

  private readonly _changes$: Subject<FormAction<T>> = new Subject();

  constructor(options: FormBeanOptions<T> = { validOnChange: false }) {
    super({
      values: options.initialValues || ({} as T),
      errors: {},
      touched: {},
    });
    this._options = options;

    this._changes$.subscribe(ac => {
      if (ac.action === 'SET_VALUES') {
        this.next({
          ...this.context,
          values: {
            ...this.values,
            ...ac.payload,
          },
        });
      } else if (ac.action === 'SET_TOUCHED') {
        this.next({
          ...this.context,
          touched: {
            ...this.touched,
            ...ac.payload,
          },
        });
      } else if (ac.action === 'RESET_VALUES') {
        this.next({
          ...this.context,
          values: ac.payload as T,
        });
      } else if (ac.action === 'SET_FIELD_VALUE') {
        const values = { ...this.values };
        const f = ac.payload as FormField<T>;
        set(values, f.field, f.value);
        this.next({
          ...this.context,
          values,
        });
      } else {
        this.next({
          ...this.context,
          errors: ac.payload as FormError<T>,
        });
      }
    });
  }

  get context() {
    return this.getValue();
  }

  get values() {
    return this.context.values;
  }

  get errors() {
    return this.context.errors;
  }

  get touched() {
    return this.context.touched;
  }

  get validOnChange() {
    return this.schema !== undefined && this._options.validOnChange;
  }

  setValues(values: Partial<T>) {
    this._changes$.next({
      action: 'SET_VALUES',
      payload: values,
    });

    if (this.validOnChange) {
      return this.validate();
    } else {
      return EMPTY;
    }
  }

  setTouched(touched: FormTouched<T>) {
    this._changes$.next({
      action: 'SET_TOUCHED',
      payload: touched,
    });
  }

  setErrors(errors: FormError<T>) {
    this._changes$.next({
      action: 'SET_ERRORS',
      payload: errors,
    });
  }

  setFieldValue(field: keyof T & string, value: T[keyof T]) {
    this._changes$.next({
      action: 'SET_FIELD_VALUE',
      payload: {
        field,
        value,
      },
    });

    if (this.validOnChange) {
      return this.validate();
    } else {
      return EMPTY;
    }
  }

  validate(schema?: yup.Schema<T>): Observable<T> {
    const yupSchema = schema || this.schema;
    if (yupSchema === undefined) {
      throw new Error('miss yup schema');
    }
    this._clearErrors();
    return from(
      yupSchema
        .validate(this.values, {
          abortEarly: false,
        })
        .catch(err => {
          this._addError(err);
          return err;
        }),
    ).pipe(
      catchError(() => {
        return EMPTY;
      }),
    );
  }

  isValid(): Observable<boolean> {
    const yupSchema = this.schema;
    if (yupSchema === undefined) {
      throw new Error('miss yup schema');
    }
    this._clearErrors();
    return from(
      yupSchema.isValid(this.values, {
        abortEarly: false,
      }),
    );
  }

  reset(values: T | undefined = this._options.initialValues) {
    this._changes$.next({
      action: 'RESET_VALUES',
      payload: values,
    });
  }

  private _clearErrors() {
    this._changes$.next({
      action: 'SET_ERRORS',
      payload: {},
    });
  }

  private _addError(error: yup.ValidationError) {
    const errors = { ...this.errors };
    if (error.inner.length === 0) {
      set(errors, error.path, error.message);
    }
    for (const err of error.inner) {
      if (!(errors as any)[err.path]) {
        set(errors, err.path, err.message);
      }
    }

    this._changes$.next({
      action: 'SET_ERRORS',
      payload: errors,
    });
  }

  get schema() {
    return this._options.schema;
  }
}
