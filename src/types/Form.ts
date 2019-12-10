/* eslint-disable @typescript-eslint/no-explicit-any */
export type FormError<Values> = {
  [K in keyof Values]?: Values[K] extends any[]
    ? Values[K][number] extends object // [number] is the special sauce to get the type of array's element. More here https://github.com/Microsoft/TypeScript/pull/21316
      ? Array<FormError<Values[K][number]>> | string | string[]
      : string | string[]
    : Values[K] extends object
    ? FormError<Values[K]>
    : string;
};

export type FormTouched<Values> = {
  [K in keyof Values]?: Values[K] extends any[]
    ? Values[K][number] extends object // [number] is the special sauce to get the type of array's element. More here https://github.com/Microsoft/TypeScript/pull/21316
      ? Array<FormTouched<Values[K][number]>>
      : boolean
    : Values[K] extends object
    ? FormTouched<Values[K]>
    : boolean;
};
