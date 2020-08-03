<template>
  <div class="flex flex-row justify-center">
    <div class="flex-1 p-4 max-w-4xl">
      <form class="p-10 items-center" @submit.prevent="updateVersion">
        <t-alert v-if="errorMsg" :message="$t(errorMsg)" />

        <t-input
          id="name"
          v-model="form.version"
          :label="$t('pages.modpacks.version.name')"
          icon="code-branch"
          class="w-2/3 mb-4"
          autocomplete="off"
          :error="errors.version ? $t(errors.version) : ''"
          :disabled="
            !(version.userPerms.owner || version.userPerms.manage_modpack)
          "
        />

        <t-textarea
          id="summary"
          v-model="form.summary"
          icon="info-circle"
          :label="$t('pages.modpacks.version.summary')"
          :error="errors.summary ? $t(errors.summary) : ''"
          :disabled="
            !(version.userPerms.owner || version.userPerms.manage_modpack)
          "
        >
        </t-textarea>

        <div class="text-center mt-4">
          <t-button
            v-if="version.userPerms.owner || version.userPerms.manage_modpack"
            class="w-1/2"
            icon="pen"
            type="submit"
            :disabled="!formValid"
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
import { Context } from '@nuxt/types'
import TInput from '~/components/forms/TInput.vue'
import TAlert from '~/components/bases/TAlert.vue'
import TTextarea from '~/components/forms/TTextarea.vue'
import TButton from '~/components/forms/TButton.vue'

@Component({
  components: {
    TInput,
    TAlert,
    TTextarea,
    TButton,
  },
})
export default class ModpackVersionViewIndex extends Vue {
  errorMsg: string = ''
  errors: Partial<any> = {}

  version: Partial<any> = {}
  form: Partial<any> = {
    name: '',
    summary: '',
  }

  async asyncData({ $axios, params }: Context) {
    const version = await $axios.$get(`/api/modpack/${params.id}/version`, {
      params: {
        id: params.versionId,
      },
    })
    return {
      version,
    }
  }

  mounted() {
    this.form = this.version
  }

  updateVersion() {}

  get formValid() {
    return this.form.version?.length > 0
  }
}
</script>
