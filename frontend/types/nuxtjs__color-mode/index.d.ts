// Type definitions for @nuxtjs/color-mode 1.0
// Project: https://github.com/nuxt-community/color-mode-module
// Definitions by: Ruskin Constant <https://github.com/Bricklou>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 3.8.3

export interface ColorMode<T = any> {
  preference: string
  value: string
  unknown: boolean
}

declare module 'vue/types/vue' {
  interface Vue {
    $colorMode: ColorMode
  }
}

declare module '@nuxt/vue-app' {
  interface Context {
    $colorMode: ColorMode
  }
}

declare module '@nuxt/types' {
  interface Context {
    $colorMode: ColorMode
  }
}
