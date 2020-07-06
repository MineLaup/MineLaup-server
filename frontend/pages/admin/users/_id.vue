<template>
  <div class="flex flex-row justify-center">
    <div class="flex-1 p-4 max-w-4xl overflow-y-auto">
      <h1 class="text-2xl uppercase text-gray-900 dark:text-white font-bold">
        {{ $t('pages.admin.users.update.title') }}
      </h1>

      <form
        ref="create_user_form"
        class="p-10 items-center"
        @submit.prevent="updateUser"
      >
        <t-alert v-if="errorMsg" :message="$t(errorMsg)" />

        <t-input
          id="username"
          v-model="form.username"
          :label="$t('pages.admin.users.update.username')"
          icon="user"
          class="w-2/3 mb-4"
          autocomplete="off"
          :error="errors.username ? $t(errors.username) : ''"
        />

        <t-input
          id="first_name"
          v-model="form.first_name"
          :label="$t('pages.admin.users.update.first_name')"
          icon="user"
          class="w-2/3 mb-4"
          autocomplete="off"
          :error="errors.first_name ? $t(errors.first_name) : ''"
        />

        <t-input
          id="last_name"
          v-model="form.last_name"
          :label="$t('pages.admin.users.update.last_name')"
          icon="user"
          class="w-2/3 mb-4"
          autocomplete="off"
          :error="errors.last_name ? $t(errors.last_name) : ''"
        />

        <t-input
          id="email"
          v-model="form.email"
          :label="$t('pages.admin.users.update.email')"
          icon="envelope"
          class="w-2/3 mb-4"
          autocomplete="off"
          type="email"
          :error="errors.email ? $t(errors.email) : ''"
        />

        <t-input
          id="email"
          v-model="form.role"
          :label="$t('pages.admin.users.update.role')"
          icon="user-tag"
          class="w-2/3 mb-4"
          autocomplete="off"
          type="number"
          max="3"
          min="0"
          :disabled="$auth.user.id === user.id"
          :error="errors.email ? $t(errors.email) : ''"
        />

        <div class="text-center mt-4">
          <t-button
            class="w-1/2"
            icon="save"
            type="submit"
            :disabled="!formValid"
          >
            {{ $t('pages.admin.users.update.submit') }}
          </t-button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import { Context } from '@nuxt/types'
import TButton from '~/components/forms/TButton.vue'
import TTextarea from '~/components/forms/TTextarea.vue'
import TInput from '~/components/forms/TInput.vue'
import TAlert from '~/components/bases/TAlert.vue'

@Component({
  components: {
    TButton,
    TTextarea,
    TInput,
    TAlert,
  },
})
export default class AdminUserUpdate extends Vue {
  errorMsg: string = ''

  form = {
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    role: '0',
  }

  user: Partial<any> = {}

  errors: Partial<String> = {}

  async asyncData({ params, $axios }: Context) {
    const user = await $axios.$get('/api/admin/user', {
      params: {
        id: params.id,
      },
    })
    return { user }
  }

  mounted() {
    this.form = {
      username: this.user.username,
      first_name: this.user.first_name,
      last_name: this.user.last_name,
      email: this.user.email,
      role: '' + this.user.role,
    }

    document.addEventListener('keypress', (event: KeyboardEvent) => {
      if (event.keyCode !== 10 || !event.ctrlKey) return

      this.updateUser()
    })
  }

  get formValid() {
    return (
      this.form.username.length > 0 &&
      this.form.email.length > 0 &&
      [0, 1, 2, 3].includes(parseInt(this.form.role))
    )
  }

  updateUser() {
    this.errors = {}
    this.errorMsg = ''

    this.$axios
      .put('/api/admin/user/', this.form, {
        params: {
          id: this.user.id,
        },
      })
      .then(() => {
        this.$router.push(`/admin/users`)
      })
      .catch((error) => {
        if (error.response?.status) {
          const parsedErrors: Partial<String> = {}
          switch (error.response.status) {
            case 400:
              this.errors = Object.assign({}, error.response.data.errors)
              break
            case 422:
              for (const e of error.response.data.errors) {
                parsedErrors[e.field] = `error.form.${e.rule}`
              }
              this.errors = parsedErrors
              break
            case 500:
              this.errorMsg = error.response.data.errors.message
              break
            default:
              this.errorMsg = 'error.unknown'
          }
        } else {
          // eslint-disable-next-line
          console.error(error)
          this.errorMsg = 'error.unknown'
        }
      })
  }
}
</script>
