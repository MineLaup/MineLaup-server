<template>
  <div class="flex flex-row justify-center">
    <div class="flex-1 p-4 max-w-4xl">
      <h1 class="font-bold text-3xl text-gray-900 dark:text-white uppercase">
        {{ $t('pages.modpacks.new-version.title') }}
      </h1>

      <form class="p-10 items-center" @submit.prevent="createModpackVersion">
        <t-alert
          type="info"
          :message="$t('pages.modpacks.new-version.information')"
        />

        <t-alert v-if="errorMsg" :message="$t(errorMsg)" />

        <t-input
          id="version"
          v-model="form.version"
          :label="$t('pages.modpacks.new-version.version')"
          icon="code-branch"
          class="w-2/3 mb-4"
          autocomplete="off"
          :error="errors.version ? $t(errors.version) : ''"
        />

        <t-textarea
          id="summary"
          v-model="form.summary"
          icon="info-circle"
          :label="$t('pages.modpacks.new-version.summary')"
          :error="errors.summary ? $t(errors.summary) : ''"
        >
        </t-textarea>

        <div class="text-center mt-4">
          <t-button
            class="w-1/2"
            icon="plus"
            type="submit"
            :disabled="!formValid"
          >
            {{ $t('pages.modpacks.new-version.submit') }}
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
import TTextarea from '~/components/forms/TTextarea.vue'

@Component({
  components: {
    TAlert,
    TInput,
    TButton,
    TTextarea,
  },
})
export default class ModpackViewNewVersion extends Vue {
  form: Partial<any> = {
    version: '',
    summary: '',
  }

  errorMsg: string = ''
  errors: Partial<any> = {}

  get formValid() {
    return true
  }

  createModpackVersion() {
    this.$axios
      .$post(`/api/modpack/${this.$route.params.id}/versions`, this.form)
      .then(() => {
        this.$router.push(`/modpacks/${this.$route.params.id}/`)
      })
      .catch((error) => {
        // On failed, check the response state
        if (error.response?.status) {
          const parsedErrors: Partial<String> = {}
          switch (error.response.status) {
            // 422: data validation error
            case 422:
              for (const e of error.response.data.errors) {
                parsedErrors[e.field] = `error.form.${e.rule}`
              }
              this.errors = parsedErrors
              break
            // 500: server error
            case 500:
              this.errorMsg = error.response.data.errors[0].message
              break
            // Unknown error
            default:
              this.errorMsg = 'error.unknown'
          }
        } else {
          // Unknown error
          // eslint-disable-next-line
          console.error(error)
          this.errorMsg = 'error.unknown'
        }
      })
  }
}
</script>
