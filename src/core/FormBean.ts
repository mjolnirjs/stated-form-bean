import { BehaviorSubject, from, Observable, Subject } from 'rxjs';

import { FormError, FormTouched } from '../types';

import set from 'set-value';
import * as yup from 'yup';

export interface FormDataOptions<Values> {
  initialValues?: Values;
  schema?: yup.Schema<Values>;
  validOnChange?: boolean;
}

export interface FormDataContext<Values> {
  values: Values;
  errors: FormError<Values>;
  touched: FormTouched<Values>;
}

type Action = 'SET_VALUES' | 'SET_ERRORS' | 'SET_TOUCHED' | 'RESET_VALUES';

interface FormAction<T> {
  action: Action;
  payload: Partial<T> | FormTouched<T> | FormError<T> | undefined;
}

export class FormBean<T> extends BehaviorSubject<FormDataContext<T>> {
  private readonly _options: FormDataOptions<T>;

  private readonly _changes$: Subject<FormAction<T>> = new Subject();

  constructor(options: FormDataOptions<T> = { validOnChange: false }) {
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

  setValues(values: Partial<T>) {
    this._changes$.next({
      action: 'SET_VALUES',
      payload: values,
    });
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
          throw err;
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
