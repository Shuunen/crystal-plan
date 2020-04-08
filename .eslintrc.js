// eslint-disable-next-line @typescript-eslint/no-var-requires
const rules = require('./.eslintrc.rules.js')

module.exports = {
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard',
    '@vue/typescript/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules,
}
