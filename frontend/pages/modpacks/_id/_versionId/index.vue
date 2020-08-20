<template>
  <div class="flex flex-row justify-center">
    <div class="flex-1 p-4 max-w-4xl">
      <form
        v-if="Object.keys(version).length > 0"
        class="p-10 items-center"
        @submit.prevent="updateVersion"
      >
        <t-alert v-if="errorMsg" :message="$t(errorMsg)" />

        <t-input
          id="name"
          v-model="form.version"
          :label="$t('pages.modpacks.version.name')"
          icon="code-branch"
          class="mb-4"
          autocomplete="off"
          :error="errors.version ? $t(errors.version) : ''"
          :disabled="
            !(version.userPerms.owner || version.userPerms.manage_modpack) ||
            !(version.canEdit && !version.published)
          "
        />

        <t-textarea
          id="summary"
          v-model="form.summary"
          icon="info-circle"
          class="mb-4"
          :label="$t('pages.modpacks.version.summary')"
          :error="errors.summary ? $t(errors.summary) : ''"
          :disabled="
            !(version.userPerms.owner || version.userPerms.manage_modpack) ||
            !(version.canEdit && !version.published)
          "
        >
        </t-textarea>

        <t-checkbox
          id="published"
          v-model="form.published"
          icon="play"
          :label="$t('pages.modpacks.version.published')"
          :on-text="$t('pages.modpacks.version.is-published')"
          :off-text="$t('pages.modpacks.version.not-published')"
          :disabled="
            !(version.userPerms.owner || version.userPerms.manage_modpack) ||
            !version.canEdit
          "
        />

        <div class="text-center mt-4">
          <t-button
            v-if="version.userPerms.owner || version.userPerms.manage_modpack"
            class="w-1/2"
            icon="pen"
            type="submit"
            :disabled="!formValid || !version.canEdit"
          >
            {{ $t('pages.teams.view.index.update-btn') }}
          </t-button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import TInput from '~/components/forms/TInput.vue'
import TAlert from '~/components/bases/TAlert.vue'
import TTextarea from '~/components/forms/TTextarea.vue'
import TButton from '~/components/forms/TButton.vue'
import TCheckbox from '~/components/forms/TCheckbox.vue'

@Component({
  components: {
    TInput,
    TAlert,
    TTextarea,
    TButton,
    TCheckbox,
  },
})
export default class ModpackVersionViewIndex extends Vue {
  errorMsg: string = ''
  errors: Partial<any> = {}

  version: Partial<any> = {}
  form: Partial<any> = {
    name: '',
    summary: '',
    published: false,
  }

  async fetch() {
    const version = await this.$axios.$get(
      `/api/modpack/${this.$route.params.id}/version`,
      {
        params: {
          id: this.$route.params.versionId,
        },
      }
    )

    this.version = version
    this.form = this.version
  }

  updateVersion() {
    this.$axios
      .$put(`/api/modpack/${this.$route.params.id}/version`, this.form, {
        params: {
          id: this.$route.params.versionId,
        },
      })
      .then(() => this.$fetch())
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

  get formValid() {
    return this.form.version?.length > 0
  }
}
</script>
