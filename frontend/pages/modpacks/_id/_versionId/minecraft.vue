<template>
  <div class="flex flex-row justify-center">
    <div class="flex-1 p-4 max-w-4xl">
      <form class="p-10 items-center" @submit.prevent="updateMinecraft">
        <t-alert v-if="errorMsg" :message="$t(errorMsg)" />

        <t-select
          id="mc_version"
          v-model="form.mcVersion"
          :label="$t('pages.modpacks.minecraft.mc_version')"
          :error="errors.mcVersion ? $t(errors.mcVersion) : ''"
          icon="code-branch"
          class="mb-4"
        >
          <option
            v-for="version in mcVersions"
            :key="version.id"
            :value="version.id"
          >
            {{ version.id }}
          </option>
        </t-select>

        <t-checkbox
          id="enable_forge"
          v-model="form.enableForge"
          :label="$t('pages.modpacks.minecraft.enable_forge')"
          :error="errors.enable_forge ? $t(errors.enable_forge) : ''"
          :on-text="$t('pages.modpacks.minecraft.forge_enabled')"
          :off-text="$t('pages.modpacks.minecraft.forge_disabled')"
          class="mb-4"
        />

        <t-select
          id="forge_version"
          v-model="form.forgeVersion"
          :label="$t('pages.modpacks.minecraft.forge_version')"
          :errors="errors.forgeVersion ? $t(errors.forgeVersion) : ''"
          icon="code-branch"
          class="mb-4"
          :disabled="!form.enableForge"
        >
          <option
            v-for="version in forgeVersions"
            :key="version.name"
            :value="version.name"
          >
            {{ `${version.gameVersion} - ${version.name}` }}
          </option>
        </t-select>

        <div class="text-center mt-4">
          <t-button
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
import TAlert from '~/components/bases/TAlert.vue'
import TSelect from '~/components/forms/TSelect.vue'
import TCheckbox from '~/components/forms/TCheckbox.vue'
import TButton from '~/components/forms/TButton.vue'

@Component({
  components: {
    TAlert,
    TSelect,
    TCheckbox,
    TButton,
  },
})
export default class ModpackVersionViewMinecraft extends Vue {
  errorMsg: string = ''
  errors: Partial<any> = {}

  version: Partial<any> = {}
  mcVersions: Array<Partial<any>> = []
  forgeVersionsFull: Array<Partial<any>> = []

  form = {
    mcVersion: '',
    enableForge: false,
    forgeVersion: '',
  }

  async asyncData({ $axios, params }: Context) {
    const version = await $axios.$get(`/api/modpack/${params.id}/version`, {
      params: {
        id: params.versionId,
      },
    })

    const { versions: mcVersions } = await $axios.$get(
      'https://launchermeta.mojang.com/mc/game/version_manifest.json'
    )

    const forgeVersionsFull = await $axios.$get('/curse/minecraft/modloader')

    return {
      mcVersions,
      forgeVersionsFull,
      version,
    }
  }

  mounted() {
    this.form.mcVersion = this.version.mc_version || ''
    this.form.enableForge = !!this.version.forge_version
    this.form.forgeVersion = this.version.forge_version || ''
  }

  unmounted() {
    document.removeEventListener('keypress', this.onKeypressed)
  }

  onKeypressed(event: KeyboardEvent) {
    if (event.keyCode !== 10 || !event.ctrlKey || !this.formValid) return

    this.updateMinecraft()
  }

  get formValid() {
    return (
      this.form.mcVersion.length > 0 &&
      (!this.form.enableForge || this.form.forgeVersion.length > 0)
    )
  }

  get forgeVersions() {
    return this.forgeVersionsFull.filter((v) => {
      return v.gameVersion === this.form.mcVersion
    })
  }

  updateMinecraft() {
    this.$axios
      .$post(`/api/modpack/${this.$route.params.id}/minecraft`, this.form, {
        params: {
          id: this.$route.params.versionId,
        },
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
