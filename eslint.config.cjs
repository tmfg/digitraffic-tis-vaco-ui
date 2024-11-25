const typescriptPlugin = require('@typescript-eslint/eslint-plugin');
const parser = require('@typescript-eslint/parser');

module.exports = [
  {
    languageOptions: {
      parser,  // Use the TypeScript parser
      parserOptions: {
        ecmaVersion: 'latest',  // Use the latest ECMAScript version
        sourceType: 'module',   // Support module syntax (import/export)
      },
    },

    // Define plugins used in this configuration
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






