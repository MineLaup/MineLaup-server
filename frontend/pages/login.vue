<template>
  <div
    id="login"
    class="flex flex-row justify-center content-center bg-gray-100 dark:bg-gray-700"
  >
    <div
      class="rounded-md p-8 bg-gray-800 text-white my-auto lg:w-1/2 md:w-2/3 w-full md:mx-4 mx-2 shadow-2xl"
    >
      <img
        src="~/assets/images/logo-1024.png"
        alt="App logo"
        class="w-56 px-10 mx-auto"
      />
      <h1 class="font-bold text-3xl mb-2 uppercase text-center leading-none">
        {{ $t('pages.login.title') }}
      </h1>

      <form ref="form" @submit.prevent="login">
        <t-alert v-if="errorMsg" :message="$t(errorMsg)" type="error"></t-alert>

        <t-input
          id="username"
          v-model="form.username"
          class="w-full sm:px-10 mb-6"
          :label="$t('pages.login.username')"
          icon="user"
          :error="errors.username ? $t(errors.username) : ''"
        />

        <t-input
          id="password"
          v-model="form.password"
          class="w-full sm:px-10 mb-6"
          :label="$t('pages.login.password')"
          icon="lock"
          type="password"
          :error="errors.password ? $t(errors.password) : ''"
        />

        <div class="w-full text-center">
          <t-button
            type="submit"
            icon="sign-in-alt"
            class="md:w-1/3 w-full"
            color="white"
          >
            {{ $t('pages.login.btn') }}
          </t-button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import TAlert from '~/components/bases/TAlert.vue'
import TInput from '~/components/forms/TInput.vue'
import TButton from '~/components/forms/TButton.vue'

@Component({
  components: {
    TAlert,
    TInput,
    TButton,
  },
})
export default class Login extends Vue {
  layout() {
    return 'empty'
  }

  errorMsg: string = ''

  form = {
    username: '',
    password: '',
  }

  errors: Partial<String> = {}

  // Called when the form is submitted
  login() {
    this.errorMsg = ''
    this.errors = {}

    // Try to login the user
    this.$auth
      .login({ data: this.form })
      .then(() => {
        // If success, set the app locale to the user preference
        this.$i18n.setLocale(this.$auth.user.language)
      })
      .catch((error: any) => {
        // On failed, check the response status
        if (error.response?.status) {
          const parsedErrors: Partial<String> = {}
          switch (error.response.status) {
            // 400: Bad request, the auth informations are wrongs
            case 400:
              this.errorMsg = 'error.login.wrong_ids'
              break
            // 422: data validation error
            case 422:
              for (const e of error.response.data.errors) {
                parsedErrors[e.field] = `error.form.${e.rule}`
              }
              this.errors = parsedErrors
              break
            // unknonw error
            default:
              this.errorMsg = 'error.unknown'
          }
        }
      })
  }
}
</script>

<style lang="scss">
#login {
  background-image: url("data:image/svg+xml,%3Csvg width='76' height='18' viewBox='0 0 76 18' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M32 18c-2.43-1.824-4-4.73-4-8 0-4.418-3.582-8-8-8H0V0h20c5.523 0 10 4.477 10 10 0 4.418 3.582 8 8 8h20c4.418 0 8-3.582 8-8 0-5.523 4.477-10 10-10v2c-4.418 0-8 3.582-8 8 0 3.27-1.57 6.176-4 8H32zM64 0c-1.67 1.256-3.748 2-6 2H38c-2.252 0-4.33-.744-6-2h32z' fill='%232d3748' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E");
}

.dark-mode #login {
  background-image: url("data:image/svg+xml,%3Csvg width='76' height='18' viewBox='0 0 76 18' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M32 18c-2.43-1.824-4-4.73-4-8 0-4.418-3.582-8-8-8H0V0h20c5.523 0 10 4.477 10 10 0 4.418 3.582 8 8 8h20c4.418 0 8-3.582 8-8 0-5.523 4.477-10 10-10v2c-4.418 0-8 3.582-8 8 0 3.27-1.57 6.176-4 8H32zM64 0c-1.67 1.256-3.748 2-6 2H38c-2.252 0-4.33-.744-6-2h32z' fill='%23a0aec0' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E");
}
</style>
