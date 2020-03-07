import { useMemo } from 'react';
import { useObservable } from 'stated-bean';

import { FormBean } from '../core';

export function useFormBean<T>(formBean: FormBean<T>): FormBean<T> {
  const form = useObservable(formBean);

  if (form === null) {
    throw new Error("formBean can't be null");
  }

  const proxyFormBean = useMemo(
    () => ({
      setValues: formBean.setValues.bind(formBean),
      setTouched: formBean.setTouched.bind(formBean),
      setFieldValue: formBean.setFieldValue.bind(formBean),
      reset: formBean.reset.bind(formBean),
      validate: formBean.validate.bind(formBean),
      isValid: formBean.isValid.bind(formBean),
      validateField: formBean.validateField.bind(formBean),
    }),
    [formBean],
  );

  return {
    values: form.values,
    errors: form.errors,
    touched: form.touched,
    ...proxyFormBean,
  } as FormBean<T>;
}
