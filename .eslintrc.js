// eslint-disable-next-line @typescript-eslint/no-var-requires
const rules = require('./.eslintrc.rules.js')

module.exports = {
  env: {
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/recommended',
    '@vue/standard',
    '@vue/typescript/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules,
}
