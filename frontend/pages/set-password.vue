<template>
  <div
    id="set-password"
    class="flex flex-row justify-center content-center bg-gray-100 dark:bg-gray-700"
  >
    <div
      class="rounded-md p-8 bg-gray-800 text-white my-auto lg:w-1/2 md:w-2/3 w-full md:mx-4 mx-2 shadow-2xl"
    >
      <div>
        <div class="relative text-white border-b-2 border-white w-16 ml-auto">
          <select
            class="appearance-none bg-gray-800 outline-none px-2 py-2 w-16 uppercase"
            @input="$i18n.setLocale($event.target.value)"
          >
            <option
              v-for="locale in $i18n.locales"
              :key="locale.code"
              :value="locale.code"
              :selected="locale.code === $i18n.locale"
              >{{ locale.code }}</option
            >
          </select>

          <span class="absolute right-0 mr-2 mt-2 pointer-events-none">
            <i class="fas fa-caret-down"></i>
          </span>
        </div>
      </div>
      <img
        src="~/assets/images/logo-1024.png"
        alt="App logo"
        class="w-56 px-10 mx-auto"
      />
      <h1 class="font-bold text-3xl mb-2 uppercase text-center leading-none">
        {{ $t('pages.set-password.title', { username }) }}
      </h1>

      <p class="font-bold text-xl mb-5 uppercase text-center leading-none">
        {{ $t('pages.set-password.description') }}
      </p>

      <form ref="form" @submit.prevent="setPassword">
        <t-alert v-if="errorMsg" :message="$t(errorMsg)" type="error"></t-alert>

        <t-input
          id="new-password"
          v-model="form.new_pass"
          class="w-full sm:px-10 mb-6"
          :label="$t('pages.set-password.new-password')"
          icon="lock"
          type="password"
          :error="errors.new_pass ? $t(errors.new_pass) : ''"
        />

        <t-input
          id="new-password-confirmation"
          v-model="form.new_pass_confirmation"
          class="w-full sm:px-10 mb-6"
          :label="$t('pages.set-password.new-password-confirmation')"
          icon="lock"
          type="password"
          :error="
            errors.new_pass_confirmation ? $t(errors.new_pass_confirmation) : ''
          "
        />

        <div class="w-full text-center">
          <t-button
            type="submit"
            icon="save"
            class="md:w-1/3 w-full"
            color="white"
          >
            {{ $t('pages.set-password.btn') }}
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
  auth: 'guest',
})
export default class SetPassword extends Vue {
  layout() {
    return 'empty'
  }

  username = 'test'

  errorMsg: string = ''

  form = {
    new_password: '',
    new_password_confirmation: '',
  }

  errors: Partial<String> = {}

  setPassword() {
    this.errorMsg = ''
    this.errors = {}
  }
}
</script>

<style lang="scss" scoped>
#set-password {
  background-image: url("data:image/svg+xml,%3Csvg width='76' height='18' viewBox='0 0 76 18' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M32 18c-2.43-1.824-4-4.73-4-8 0-4.418-3.582-8-8-8H0V0h20c5.523 0 10 4.477 10 10 0 4.418 3.582 8 8 8h20c4.418 0 8-3.582 8-8 0-5.523 4.477-10 10-10v2c-4.418 0-8 3.582-8 8 0 3.27-1.57 6.176-4 8H32zM64 0c-1.67 1.256-3.748 2-6 2H38c-2.252 0-4.33-.744-6-2h32z' fill='%232d3748' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E");
}
</style>
