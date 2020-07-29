<template>
  <div v-if="modpack" class="flex flex-col">
    <div class="h-64 bg-gray-200 dark:bg-gray-600 p-10">
      <div class="flex flex-row">
        <h1
          class="font-bold uppercase text-3xl text-gray-900 dark:text-white flex-1"
        >
          {{ modpack.name }}
        </h1>
        <div v-if="modpack.userPerms.owner || modpack.userPerms.manage_modpack">
          <i
            class="fas fa-trash text-red-500 hover:text-red-400 cursor-pointer"
            @click="openDeleteTeamModal"
          ></i>
        </div>
      </div>
      <div class="mx-8">
        <p class="text-gray-800">
          {{ $t('pages.modpack.index.team_name', [modpack.team.name]) }}
        </p>
        <p class="text-gray-800 italic">
          {{ modpack.summary }}
        </p>
      </div>
    </div>
    <div class="flex-1"></div>

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
          @click="deleteModpack"
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
import { Vue, Component, Watch } from 'nuxt-property-decorator'
import TButton from '~/components/forms/TButton.vue'
import TModal from '~/components/bases/TModal.vue'

@Component({
  components: {
    TButton,
    TModal,
  },
})
export default class ModpackViewIndex extends Vue {
  modpack: Partial<any> | null = null

  deleteModal: Partial<any> = {}

  async fetch() {
    // Fetch modpack informations
    const modpack = await this.$axios.$get(
      `/api/modpack/${this.$route.params.id}`
    )

    this.modpack = modpack
  }

  // open the delete team modal confirmation
  openDeleteTeamModal() {
    this.deleteModal = {
      title: 'pages.modpacks.index.confirmDelete',
    }
  }

  // Delete modpack action
  deleteModpack() {
    // Request the APi to delete the modpack
    this.$axios
      .delete(`/api/modpack/${this.$route.params.id}`)
      .then(async () => {
        // On success, fetch teams list and update it
        let teams = await this.$axios.$get('/api/modpacks')

        teams = teams.filter((team: Partial<any>) => {
          return team.modpacks?.length
        })

        let modpacks: Array<Partial<any>> = []

        teams.forEach((team: Partial<any>) => {
          modpacks = modpacks.concat(
            team.modpacks.map((modpack: Partial<any>) => ({
              name: modpack.name,
              path: `/modpacks/${modpack.id}`,
            }))
          )
        })

        if (teams) {
          this.$store.commit('menu/setList', modpacks)
        }

        // Finally redirect the user to the main route
        this.$router.push('/modpacks')
      })
      .catch((error) => {
        // If failed, log the error in the console
        // eslint-disable-next-line
        console.error(error)
      })
  }

  @Watch('$route')
  onRouteChange(current: Partial<any>) {
    // On route change, if the page name still the same, then refetch team informations
    if (current.name === 'modpacks-id') {
      this.$fetch()
    }
  }
}
</script>
