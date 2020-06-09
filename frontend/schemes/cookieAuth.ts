import { Auth } from '@nuxtjs/auth'

export default class CookieScheme {
  $auth!: Auth
  name!: string
  options!: Partial<any>

  constructor(auth: Auth, options: Partial<any>) {
    this.$auth = auth
    this.name = options._name

    this.options = Object.assign({}, DEFAULTS, options)
  }

  mounted() {
    return this.$auth.fetchUserOnce()
  }

  async login(endpoint: String) {
    if (!this.options.endpoints.login) {
      return
    }

    // Ditch any leftover local tokens before attempting to log in
    await this.$auth.reset()

    // @ts-ignore
    const { response } = await this.$auth.request(
      endpoint,
      this.options.endpoints.login,
      true
    )

    await this.$auth.fetchUser()

    return response
  }

  async fetchUser(endpoint: String = '') {
    // User endpoint is disabled.
    if (!this.options.endpoints.user) {
      this.$auth.setUser({})
      return
    }

    // Try to fetch user and then set
    // @ts-ignore
    const user = await this.$auth.requestWith(
      this.name,
      endpoint,
      this.options.endpoints.user
    )
    this.$auth.setUser(user)
  }

  async logout(endpoint: String) {
    // Only connect to logout endpoint if it's configured
    if (this.options.endpoints.logout) {
      await this.$auth
        // @ts-ignore
        .requestWith(this.name, endpoint, this.options.endpoints.logout)
        .catch(() => {})
    }

    // But reset regardless
    return this.$auth.reset()
  }

  reset() {
    // @ts-ignore
    this.$auth.setUser(false)

    return Promise.resolve()
  }
}

const DEFAULTS = {
  autoFetchUser: true,
}
