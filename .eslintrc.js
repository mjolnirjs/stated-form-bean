const { overrides } = require('@1stg/eslint-config/overrides');

module.exports = {
  extends: '@1stg',
  overrides: [
    ...overrides,
    {
      files: '*.{ts,tsx}',
      rules: {
        '@typescript-eslint/no-explicit-any': 0,
        '@typescript-eslint/no-floating-promises': 0,
      },
    },
  ],
  settings: {
    polyfills: ['Symbol'],
  },
};
