<template>
  <div class="p-10">
    <div class="flex flex-row mb-4">
      <span class="flex-1 uppercase text-gray-900 dark:text-white font-bold">
        {{ $t('pages.modpacks.index.versions') }}
      </span>
      <span>
        <nuxt-link
          v-if="(versions[0] && versions[0].published) || versions.length === 0"
          :to="'/modpacks/' + $route.params.id + '/new-version'"
        >
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
        class="hover:bg-gray-100 dark-hover:bg-gray-600 transition-colors duration-75 border-b border-gray-200 last:border-transparent"
      >
        <router-link
          class="p-4 flex flex-row bg-gray-200 dark:bg-gray-800"
          :to="`/modpacks/${$route.params.id}/${version.id}`"
        >
          <span class="flex-1">
            {{ version.version }}
          </span>
          <span class="italic text-gray-600 dark:text-gray-300 flex-1">
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
                @click="openDeleteVersionModal(version.id)"
              />
            </span>
          </span>
        </router-link>
        <div class="py-2 px-8 dark:text-gray-200 text-gray-700">
          {{
            version.summary
              ? version.summary
              : $t('pages.modpacks.index.no_summary')
          }}
        </div>
      </div>
      <div v-if="versions.length == 0" class="p-4">
        {{ $t('pages.modpacks.index.no_version') }}
      </div>
    </div>

    <t-modal
      v-if="Object.keys(deleteModal).length > 0"
      @close-modal="deleteModal = {}"
    >
      <h1 slot="title">{{ $t(deleteModal.title) }}</h1>
      <div slot="actions" class="flex flex-col">
        <t-button
          class="mb-2"
          bg-hover-color="red-500"
          dark-bg-hover-color="red-500"
          @click="deleteVersion"
        >
          {{ $t('components.modal.yes') }}
        </t-button>
        <t-button
          class="mb-2"
          bg-hover-color="gray-900"
          dark-color="white"
          dark-bg-hover-color="white"
          dark-hover-color="gray-900"
          @click="deleteModal = {}"
        >
          {{ $t('components.modal.no') }}
        </t-button>
      </div>
    </t-modal>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import TModal from '~/components/bases/TModal.vue'
import TButton from '~/components/forms/TButton.vue'

@Component({
  components: {
    TModal,
    TButton,
  },
})
export default class ModpackViewIndex extends Vue {
  versions: Array<Partial<any>> = []

  deleteModal: Partial<any> = {}

  async fetch() {
    const versions = await this.$axios.$get(
      `/api/modpack/${this.$route.params.id}/versions`
    )

    this.versions = versions
  }

  openDeleteVersionModal(id: number) {
    this.deleteModal = {
      title: 'pages.modpacks.view.confirmDelete',
      selected: id,
    }
  }

  deleteVersion() {
    // Request the APi to delete the modpack
    this.$axios
      .delete(`/api/modpack/${this.$route.params.id}/version`, {
        params: {
          id: this.deleteModal.selected,
        },
      })
      .then(async () => {
        await this.$fetch()
        this.deleteModal = {}
      })
      .catch((error) => {
        // If failed, log the error in the console
        // eslint-disable-next-line
        console.error(error)
      })
  }
}
</script>
