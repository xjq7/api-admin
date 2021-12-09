module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['plugin:react/recommended', 'airbnb'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 13,
    sourceType: 'module',
  },
  plugins: ['react', '@typescript-eslint'],
  globals: {
    AlignType: 'readonly',
  },
  rules: {
    'import/no-unresolved': 0,
    'import/extensions': 0,
    'linebreak-style': 0,
    'no-shadow': 0,
    'no-empty': ['error', { allowEmptyCatch: true }],
    'react/jsx-filename-extension': 0,
    'object-curly-newline': 0,
    'func-names': ['error', 'as-needed'],
    'max-len': 0,
    'react/react-in-jsx-scope': 0,
    'import/prefer-default-export': 0,
    'no-restricted-globals': 0,
    'import/no-extraneous-dependencies': [
      'error',
      { devDependencies: true, optionalDependencies: false, peerDependencies: false },
    ],
  },
};
