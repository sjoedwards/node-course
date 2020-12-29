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
    "plugin:jest/recommended",
    "plugin:jest/style",
  ],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    "linebreak-style": ["error", "unix"],
    semi: ["error", "always"],
  },
};
