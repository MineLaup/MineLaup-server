/// <reference types="sanitize-html" />

import sanitize from 'sanitize-html'

declare module 'vue/types/vue' {
  interface Vue {
    $sanitize(dirty: string, options?: sanitize.IOptions): string
  }
}

declare module '@nuxt/vue-app' {
  interface Context {
    $sanitize(dirty: string, options?: sanitize.IOptions): string
  }
}

declare module '@nuxt/types' {
  interface Context {
    $sanitize(dirty: string, options?: sanitize.IOptions): string
  }
}
