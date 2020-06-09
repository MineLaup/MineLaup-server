const path = require('path')

module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  extends: [
    '@nuxtjs/eslint-config-typescript',
    'prettier',
    'prettier/vue',
    'plugin:prettier/recommended',
    'plugin:nuxt/recommended',
    'plugin:vue-i18n/recommended',
  ],
  plugins: ['prettier'],
  // add your custom rules here
  rules: {
    'nuxt/no-cjs-in-config': 'off',
  },
  settings: {
    'vue-i18n': {
      localeDir: path.resolve(__dirname, './lang/*.json'), // extention is glob formatting!
    },
  },
}
