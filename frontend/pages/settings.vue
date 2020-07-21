<template>
  <div class="flex flex-row justify-center">
    <div class="flex-1 p-4 max-w-4xl overflow-y-auto">
      <h1 class="text-2xl uppercase text-gray-900 dark:text-white font-bold">
        {{ $t('pages.settings.title') }}
      </h1>

      <form
        ref="settings_form"
        class="p-10 items-center"
        @submit.prevent="updateSettings"
      >
        <t-alert v-if="errorMsg" :message="$t(errorMsg)" />

        <t-input
          id="username"
          v-model="form.username"
          :label="$t('pages.settings.username')"
          icon="user"
          class="w-2/3 mb-4"
          autocomplete="off"
          :error="errors.username ? $t(errors.username) : ''"
        />

        <t-input
          id="email"
          v-model="form.email"
          :label="$t('pages.settings.email')"
          icon="user"
          class="w-2/3 mb-4"
          autocomplete="off"
          type="email"
          :error="errors.email ? $t(errors.email) : ''"
        />

        <t-input
          id="first_name"
          v-model="form.first_name"
          :label="$t('pages.settings.first_name')"
          icon="user"
          class="w-2/3 mb-4"
          autocomplete="off"
          :error="errors.first_name ? $t(errors.first_name) : ''"
        />

        <t-input
          id="last_name"
          v-model="form.last_name"
          :label="$t('pages.settings.last_name')"
          icon="user"
          class="w-2/3 mb-4"
          autocomplete="off"
          :error="errors.last_name ? $t(errors.last_name) : ''"
        />

        <t-select
          id="language"
          v-model="form.language"
          :label="$t('pages.settings.language')"
          icon="globe"
          class="w-2/3 mb-4"
          :error="errors.language ? $t(errors.language) : ''"
        >
          <option
            v-for="locale in locales"
            :key="locale.iso"
            :selected="locale.code == $i18n.locale.code"
            :value="locale.code"
          >
            {{ locale.name }}
          </option>
        </t-select>

        <div class="text-center mt-4">
          <t-button
            class="w-1/2"
            icon="save"
            type="submit"
            :disabled="!formValid"
          >
            {{ $t('pages.settings.submit') }}
          </t-button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import sortBy from 'lodash/sortBy'
import { Context } from '@nuxt/types'
import cloneDeep from 'lodash/cloneDeep'
import TButton from '~/components/forms/TButton.vue'
import TInput from '~/components/forms/TInput.vue'
import TSelect from '~/components/forms/TSelect.vue'

@Component({
  components: {
    TButton,
    TInput,
    TSelect,
  },
})
export default class Settings extends Vue {
  errorMsg: string = ''

  errors: Partial<String> = {}

  form: Partial<any> = {
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    language: '',
  }

  user: Partial<any> = {}

  async asyncData({ $axios, store }: Context) {
    store.commit('menu/clear')

    const user = await $axios.$get('/api/user/auth')
    return {
      user,
    }
  }

  mounted() {
    // Submit the form when the user press CTRL+ENTER
    document.addEventListener('keypress', (event: KeyboardEvent) => {
      if (event.keyCode !== 10 || !event.ctrlKey) return

      this.updateSettings()
    })

    this.form = cloneDeep(this.user)
  }

  // The form is always valid since there is no data to validate
  get formValid() {
    return this.form.username.length > 0 && this.form.email.length > 0
  }

  // Get all availables locales
  get locales() {
    return sortBy(this.$i18n.locales, ['code'])
  }

  updateSettings() {
    this.$axios
      .put('/api/user/update', this.form)
      .then(async () => {
        this.user = await this.$axios.$get('/api/user/auth')
        this.$i18n.setLocale(this.user.language)
      })
      .catch((error) => {
        // else, check the error type
        if (error.response?.status) {
          const parsedErrors: Partial<String> = {}
          // Get the error status code
          switch (error.response.status) {
            // 402: data validation error
            case 422:
              for (const e of error.response.data.errors) {
                parsedErrors[e.field] = `error.form.${e.rule}`
              }
              this.errors = parsedErrors
              break
            // 500: server error
            case 500:
              this.errorMsg = error.response.data.errors.message
              break
            // unknown error
            default:
              this.errorMsg = 'error.unknown'
          }
        } else {
          // the error is unknown
          // eslint-disable-next-line
          console.error(error)
          this.errorMsg = 'error.unknown'
        }
      })
  }
}
</script>
