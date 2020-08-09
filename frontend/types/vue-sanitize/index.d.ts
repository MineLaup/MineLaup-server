declare module 'vue/types/vue' {
  interface Vue {
    $sanitize(html: string): string
  }
}

declare module '@nuxt/vue-app' {
  interface Context {
    $sanitize(html: string): string
  }
}

declare module '@nuxt/types' {
  interface Context {
    $sanitize(html: string): string
  }
}

declare module 'vue-sanitize' {
  const VueSanitize: any
  export default VueSanitize
}
