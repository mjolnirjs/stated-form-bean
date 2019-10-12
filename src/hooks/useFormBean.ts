import { useObservable } from 'stated-bean';

import { FormBean } from '../core';

export function useFormBean<T>(formBean: FormBean<T>) {
  const form = useObservable(formBean);

  if (form === null) {
    throw new Error("formBean can't be null");
  }

  return {
    values: form.values,
    errors: form.errors,
    touched: form.touched,
    setValues: formBean.setValues.bind(formBean),
    setTouched: formBean.setTouched.bind(formBean),
  };
}
