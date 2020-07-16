<template>
  <div class="flex flex-row justify-center">
    <div class="flex-1 p-4 max-w-4xl">
      <h1 class="font-bold text-3xl text-gray-900 dark:text-white uppercase">
        {{ $t('pages.admin.users.create.title') }}
      </h1>

      <form
        ref="create_user_form"
        class="p-10 items-center"
        @submit.prevent="createUser"
      >
        <t-alert v-if="errorMsg" :message="$t(errorMsg)" />

        <t-input
          id="username"
          v-model="form.username"
          :label="$t('pages.admin.users.create.username')"
          icon="user"
          class="w-2/3 mb-4"
          autocomplete="off"
          :error="errors.username ? $t(errors.username) : ''"
        />

        <t-input
          id="email"
          v-model="form.email"
          :label="$t('pages.admin.users.create.email')"
          icon="envelope"
          class="w-2/3 mb-4"
          autocomplete="off"
          type="email"
          :error="errors.email ? $t(errors.email) : ''"
        />

        <t-input
          id="email"
          v-model="form.role"
          :label="$t('pages.admin.users.create.role')"
          icon="user-tag"
          class="w-2/3 mb-4"
          autocomplete="off"
          type="number"
          max="3"
          min="0"
          :error="errors.role ? $t(errors.role) : ''"
        />

        <div class="text-center mt-4">
          <t-button
            class="w-1/2"
            icon="plus"
            type="submit"
            :disabled="!formValid"
          >
            {{ $t('pages.admin.users.create.submit') }}
          </t-button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import TButton from '~/components/forms/TButton.vue'
import TTextarea from '~/components/forms/TTextarea.vue'
import TInput from '~/components/forms/TInput.vue'
import TAlert from '~/components/bases/TAlert.vue'
import { UserRole } from '~/types/UserRole'

@Component({
  components: {
    TButton,
    TTextarea,
    TInput,
    TAlert,
  },
})
export default class AdminUserCreate extends Vue {
  errorMsg: string = ''

  form = {
    username: '',
    email: '',
    role: '0',
  }

  errors: Partial<String> = {}

  mounted() {
    // Submit the form when the user press CTRL+ENTER
    document.addEventListener('keypress', (event: KeyboardEvent) => {
      if (event.keyCode !== 10 || !event.ctrlKey) return

      this.createUser()
    })
  }

  // Check if the form is valid
  get formValid() {
    return (
      this.form.username.length > 0 &&
      this.form.email.length > 0 &&
      Object.values(UserRole).includes(parseInt(this.form.role))
    )
  }

  createUser() {
    this.errors = {}
    this.errorMsg = ''

    this.$axios
      .post('/api/admin/user', this.form)
      .then(() => {
        // If the request ran successfuly, redirect the user
        this.$router.push(`/admin/users`)
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
