<template>
  <div>
    <div class="flex justify-center items-center">
      <nuxt-link
        :to="`/modpacks/${$route.params.id}/${$route.params.versionId}`"
        class="p-3 border-b-4 border-transparent"
        exact-active-class="border-green-400 text-green-400"
      >
        {{ $t('pages.modpacks.view.menu.infos') }}
      </nuxt-link>
      <nuxt-link
        :to="`/modpacks/${$route.params.id}/${$route.params.versionId}/minecraft`"
        class="p-3 border-b-4 border-transparent"
        exact-active-class="border-green-400 text-green-400"
      >
        {{ $t('pages.modpacks.view.menu.minecraft') }}
      </nuxt-link>
      <nuxt-link
        :to="`/modpacks/${$route.params.id}/${$route.params.versionId}/mods`"
        class="p-3 border-b-4 border-transparent"
        exact-active-class="border-green-400 text-green-400"
      >
        {{ $t('pages.modpacks.view.menu.mods') }}
      </nuxt-link>
      <nuxt-link
        :to="`/modpacks/${$route.params.id}/${$route.params.versionId}/files`"
        class="p-3 border-b-4 border-transparent"
        exact-active-class="border-green-400 text-green-400"
      >
        {{ $t('pages.modpacks.view.menu.files') }}
      </nuxt-link>
    </div>
    <nuxt-child />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
@Component
export default class ModpackVersionView extends Vue {}
</script>
