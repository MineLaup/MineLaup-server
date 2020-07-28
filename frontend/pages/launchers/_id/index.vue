<template>
  <div v-if="launcher" class="flex flex-col">
    <div class="h-64 bg-gray-200 dark:bg-gray-600 p-10">
      <div class="flex flex-row">
        <h1
          class="font-bold uppercase text-3xl text-gray-900 dark:text-white flex-1"
        >
          {{ launcher.name }}
        </h1>
        <div
          v-if="launcher.userPerms.owner || launcher.userPerms.manage_modpack"
        >
          <i
            class="fas fa-user-tag text-gray-700 dark:text-white hover:text-gray-600 dark-hover:text-gray-400 cursor-pointer"
            @click="
              $router.push('/launchers/' + $route.params.id + '/permissions')
            "
          ></i>
          <i
            class="fas fa-trash text-red-500 hover:text-red-400 cursor-pointer"
            @click="openDeleteLauncherModal"
          ></i>
        </div>
      </div>
      <div class="mx-8">
        <p class="text-gray-800">
          {{ $t('pages.launchers.index.team_name', [launcher.team.name]) }}
        </p>
        <p class="text-gray-800 italic">
          {{ launcher.summary }}
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
          @click="deleteLauncher"
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
export default class LauncherViewIndex extends Vue {
  launcher: Partial<any> | null = null

  deleteModal: Partial<any> = {}

  async fetch() {
    // Fetch launcher informations
    const launcher = await this.$axios.$get(
      `/api/launcher/${this.$route.params.id}`
    )

    this.launcher = launcher
  }

  // open the delete team modal confirmation
  openDeleteLauncherModal() {
    this.deleteModal = {
      title: 'pages.launchers.index.confirmDelete',
    }
  }

  // Delete launcher action
  deleteLauncher() {
    // Request the APi to delete the modpack
    this.$axios
      .delete(`/api/launcher/${this.$route.params.id}`)
      .then(async () => {
        // On success, fetch teams list and update it
        let teams = await this.$axios.$get('/api/launcher')

        teams = teams.filter((team: Partial<any>) => {
          return team.launcher?.length
        })

        let launchers: Array<Partial<any>> = []

        teams.forEach((team: Partial<any>) => {
          launchers = launchers.concat(
            team.modpacks.map((launcher: Partial<any>) => ({
              name: launcher.name,
              path: `/launchers/${launcher.id}`,
            }))
          )
        })

        if (teams) {
          this.$store.commit('menu/setList', launchers)
        }

        // Finally redirect the user to the main route
        this.$router.push('/launchers')
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
