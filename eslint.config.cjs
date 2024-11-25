const typescriptPlugin = require('@typescript-eslint/eslint-plugin');
const parser = require('@typescript-eslint/parser');

module.exports = [
  {
    languageOptions: {
      parser,
      parserOptions: {
        ecmaVersion: 'latest',  // Use the latest ECMAScript
        sourceType: 'module',   // Support module syntax (import/export)
      },
    },

    plugins: {
      '@typescript-eslint': typescriptPlugin,
    },

    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
      'no-console': 'warn',
    },

    //ignores from the original .eslintignore file
    ignores: [
      '**/.eslintrc*',
      'node_modules/',
      'dist/',
      '*.svg',
      '*.ico',
      '*.json',
      '.gitignore',
      '*.md',
      '*.log',
      '*.lock',
      '**/__mocks__/',
    ],
  },
];






