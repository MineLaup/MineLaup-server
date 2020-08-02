<template>
  <div class="p-10">
    <div class="flex flex-row mb-4">
      <span class="flex-1 uppercase text-gray-900 font-bold">
        {{ $t('pages.modpacks.index.versions') }}
      </span>
      <span>
        <nuxt-link :to="'/modpacks/' + $route.params.id + '/new-version'">
          <i
            class="fas fa-plus hover:text-green-400 transition-colors duration-75"
          />
        </nuxt-link>
      </span>
    </div>

    <div class="border border-gray-300">
      <div
        v-for="(version, index) in versions"
        :key="version.id"
        class="p-4 hover:bg-gray-100 transition-colors duration-75 border-b border-gray-200 last:border-transparent flex flex-row"
      >
        <span class="flex-1">
          {{ version.version }}
        </span>
        <span class="italic text-gray-600 flex-1">
          {{
            version.published
              ? $t('pages.modpacks.index.published')
              : $t('pages.modpacks.index.not_published')
          }}
        </span>
        <span class="flex-1 text-right">
          <span v-if="index === 0">
            <i
              class="fas fa-trash text-red-500 hover:text-red-400 cursor-pointer"
            />
          </span>
        </span>
      </div>
      <div v-if="versions.length == 0" class="p-4">
        {{ $t('pages.modpacks.index.no_version') }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import TModal from '~/components/bases/TModal.vue'

@Component({
  components: {
    TModal,
  },
})
export default class ModpackViewIndex extends Vue {
  versions: Array<Partial<any>> = []

  async fetch() {
    const versions = await this.$axios.$get(
      `/api/modpack/${this.$route.params.id}/versions`
    )

    this.versions = versions
  }
}
</script>
