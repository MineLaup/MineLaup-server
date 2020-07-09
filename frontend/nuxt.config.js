export default {
  mode: 'universal',
  /*
   ** Headers of the page
   */
  head: {
    title: 'MineLaup Server',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || '',
      },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#68d391' },
  /*
   ** Global CSS
   */
  css: ['~/assets/scss/app.scss'],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    '@nuxt/typescript-build',
    // Doc: https://github.com/nuxt-community/stylelint-module
    '@nuxtjs/stylelint-module',
    // Doc: https://github.com/nuxt-community/nuxt-tailwindcss
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    // Doc: https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv',
    '@nuxtjs/proxy',
    '@nuxtjs/auth',
    'nuxt-i18n',
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    proxy: true,
  },
  /*
   ** Proxy module configuration
   ** See https://github.com/nuxt-community/proxy-module
   */
  proxy: {
    '/api': {
      target: process.env.BACKEND_URL,
      pathRewrite: {
        '^/api': '/',
      },
    },
  },
  /*
   ** Build configuration
   */
  build: {
    postcss: {
      preset: {
        features: {
          customProperties: false,
        },
      },
      plugins: {
        tailwindcss: require('./tailwind.config'),
      },
    },
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {
      // Run ESLint on save
      if (ctx.isDev) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(ts|js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/,
          options: {
            fix: true,
          },
        })
      }
    },

    transpile: ['@nuxtjs/auth'],
  },

  /*
   ** Typescript module configuration
   ** See https://typescript.nuxtjs.org
   */
  typescript: {
    typeCheck: {
      eslint: {
        enabled: true,
        files: './**/*.{ts,vue}',
      },
      typescript: {
        extensions: {
          vue: true,
          configFile: './tsconfig.json',
        },
      },
    },
  },

  /*
   ** Auth module configuration
   ** See https://auth.nuxtjs.org
   */
  auth: {
    strategies: {
      local: false,
      customStrategy: {
        _scheme: '~/schemes/cookieAuth',
        endpoints: {
          login: {
            method: 'POST',
            url: '/api/user/auth',
          },
          user: {
            method: 'GET',
            url: '/api/user/auth',
          },
          logout: {
            method: 'DELETE',
            url: '/api/user/auth',
          },
        },
        tokenRequired: true,
      },
    },

    redirect: {
      login: '/login',
      logout: '/login',
      home: '/',
    },
  },

  /*
   ** I18N configuration
   ** See https://nuxt-community.github.io/nuxt-i18n
   */
  i18n: {
    defaultLocale: 'en',
    seo: true,
    strategy: 'no_prefix',
    locales: [
      {
        code: 'fr',
        iso: 'fr-FR',
        name: 'Français',
      },
      {
        code: 'en',
        iso: 'en-US',
        name: 'English',
      },
    ],
    vueI18n: {
      fallbackLocale: 'en-US',
      messages: {
        fr: require('./lang/fr-FR.json'),
        en: require('./lang/en-US.json'),
      },
    },
  },

  router: {
    middleware: ['auth'],
  },
}
