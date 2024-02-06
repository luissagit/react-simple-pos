module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'airbnb',
    'airbnb-typescript',
    'airbnb/hooks',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  overrides: [],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: ['react', '@typescript-eslint'],
  rules: {
    'react/react-in-jsx-scope': 0,
    'import/prefer-default-export': 'off',
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    '@typescript-eslint/no-explicit-any': ['off'],
    'react-hooks/exhaustive-deps': 'off',
    'react/jsx-no-bind': [1, {
      allowArrowFunctions: true,
      allowFunctions: true,
      allowBind: true,
    }],
    'react/jsx-props-no-spreading': 'off',
    'react/require-default-props': 'off',
    'no-restricted-syntax': 'off',
  },
};
