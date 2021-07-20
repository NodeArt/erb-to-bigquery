module.exports = {
  env: {
    es2021: true,
    es6: false,
    node: false,
    browser: false,
  },
  extends: [
    'eslint:recommended',
    'plugin:sonarjs/recommended',
    'metarhia',
    'plugin:prettier/recommended',
  ],
  plugins: ['sonarjs'],
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  rules: {
    'import/no-unresolved': 'off',
  },
};
