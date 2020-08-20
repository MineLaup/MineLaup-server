<template>
  <div class="flex">
    <nuxt-child class="mods-height"></nuxt-child>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import { Context } from '@nuxt/types'

@Component
export default class ModpackViewMods extends Vue {
  async asyncData({ $axios, params, redirect }: Context) {
    const version = await $axios.$get(`/api/modpack/${params.id}/version`, {
      params: {
        id: params.versionId,
      },
    })
    if (version.forge_version === null) {
      return redirect(`/modpacks/${params.id}/${params.versionId}/`)
    }
  }
}
</script>

<style lang="scss" scoped>
.mods-height {
  height: calc(100vh - 5rem - 3rem - 8rem);
}
</style>
