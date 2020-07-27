module.exports = {
  purge: false,
  theme: {
    darkSelector: '.dark-mode',
    extend: {},
    minHeight: {
      '1': '4em',
    },
  },
  variants: {
    borderColor: [
      'dark',
      'dark-hover',
      'dark-focus',
      'dark-focus-within',
      'hover',
      'last',
    ],
    borderWidth: [
      'dark',
      'dark-hover',
      'dark-focus',
      'dark-focus-within',
      'hover',
      'last',
      'responsive',
    ],
    backgroundColor: [
      'dark',
      'dark-hover',
      'dark-group-hover',
      'dark-even',
      'dark-odd',
      'hover',
    ],
    textColor: [
      'dark',
      'dark-hover',
      'dark-active',
      'dark-placeholder',
      'hover',
    ],
    position: ['responsive', 'hover', 'focus'],
  },
  plugins: [require('tailwindcss-dark-mode')()],
}
