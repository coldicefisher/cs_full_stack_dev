// eslint.config.js (ESM)
import js from '@eslint/js';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  js.configs.recommended,

  // You can keep this; it doesn't force the new runtime by itself.
  react.configs.flat.recommended,

  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.browser, ...globals.node },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: { react, 'react-hooks': reactHooks },
    settings: {
      react: {
        version: 'detect',   // fixes the version warning
        // (optional) if you ever use a custom JSX pragma:
        // pragma: 'React',
        // fragment: 'Fragment',
      },
    },
    rules: {
      // Classic runtime requires React to be in scope:
      'react/react-in-jsx-scope': 'error',
      'react/jsx-uses-react': 'error',

      // Hooks best practices
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },

  // Optional ignores
  { ignores: ['dist/', 'build/', 'node_modules/'] },
];
