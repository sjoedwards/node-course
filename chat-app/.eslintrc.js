module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:prettier/recommended",
    "plugin:promise/recommended",
  ],
  parserOptions: {
    ecmaVersion: 12,
  },
  global: {
    jest: true,
  },
  rules: {
    "linebreak-style": ["error", "unix"],
    semi: ["error", "always"],
  },
};
