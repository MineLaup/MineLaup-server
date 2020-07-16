<template>
  <div class="flex flex-row justify-center">
    <div class="flex-1 p-4 max-w-4xl overflow-y-auto">
      <form
        ref="create_team_form"
        class="p-10 items-center"
        @submit.prevent="updateTeam"
      >
        <t-alert v-if="errorMsg" :message="$t(errorMsg)" />

        <t-input
          id="name"
          v-model="form.name"
          :label="$t('pages.teams.view.index.name')"
          icon="user-friends"
          class="w-2/3 mb-4"
          autocomplete="off"
          :error="errors.name ? $t(errors.name) : ''"
          :disabled="!(team.userPerms.owner || team.userPerms.manage_team)"
        />

        <t-textarea
          id="summary"
          v-model="form.summary"
          icon="info-circle"
          :label="$t('pages.teams.view.index.summary')"
          :error="errors.summary ? $t(errors.summary) : ''"
          :disabled="!(team.userPerms.owner || team.userPerms.manage_team)"
        >
        </t-textarea>

        <div class="text-center mt-4">
          <t-button
            v-if="team.userPerms.owner || team.userPerms.manage_team"
            class="w-1/2"
            icon="pen"
            type="submit"
            :disabled="!formValid"
          >
            {{ $t('pages.teams.view.index.update-btn') }}
          </t-button>
        </div>
      </form>

      <div>
        <div class="flex flex-row py-4">
          <h2
            class="text-xl font-semibold leading-tight uppercase text-gray-900 dark:text-white mr-4"
          >
            {{ $t('pages.teams.view.index.users') }}
          </h2>
          <span
            v-if="team.userPerms.owner || team.userPerms.manage_users"
            class="text-green-500 hover:text-green-400 transition-colors duration-150 cursor-pointer"
            @click="openSearchUserModal"
          >
            <i class="fas fa-plus"></i>
          </span>
        </div>

        <div class="overflow-x-auto">
          <div class="inline-block min-w-full overflow-hidden">
            <table class="min-w-full leading-normal rounded-lg">
              <thead>
                <tr>
                  <th
                    class="w-1/3 px-5 py-3 border-b-2 border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-900 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider"
                  >
                    {{ $t('pages.teams.view.index.list.username') }}
                  </th>
                  <th
                    class="w-1/3 px-5 py-3 border-b-2 border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-900 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider"
                  >
                    {{ $t('pages.teams.view.index.list.role') }}
                  </th>
                  <th
                    class="w-1/3 px-5 py-3 border-b-2 border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-900 text-xs font-semibold text-gray-600 uppercase dark:text-gray-400 tracking-wider text-right"
                  >
                    {{ $t('pages.teams.view.index.list.actions') }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(user, index) in users"
                  :key="index"
                  class="bg-white dark:bg-gray-800"
                >
                  <td
                    class="px-5 py-5 border-b border-gray-200 dark:border-gray-800 text-sm"
                  >
                    <div class="flex items-center">
                      <div class="ml-3">
                        <p
                          class="text-gray-900 whitespace-no-wrap dark:text-white"
                        >
                          {{ user.user.username }}
                          <i
                            v-if="team.owner_id === user.user.id"
                            class="fas fa-crown text-yellow-500"
                          ></i>
                        </p>
                      </div>
                    </div>
                  </td>
                  <td
                    class="px-5 py-5 border-b border-gray-200 dark:border-gray-800 bg-white text-sm dark:bg-gray-800"
                  >
                    <p class="text-gray-900 whitespace-no-wrap dark:text-white">
                      {{
                        team.owner_id === user.user.id
                          ? $t('pages.teams.view.index.owner')
                          : user.teamRole
                          ? user.teamRole.name
                          : $t('pages.teams.view.index.default_role')
                      }}
                    </p>
                  </td>
                  <td
                    class="px-10 py-5 border-b border-gray-200 dark:border-gray-800 bg-white text-sm text-right dark:bg-gray-800"
                  >
                    <div
                      v-if="
                        team.owner_id !== user.user.id &&
                        (team.userPerms.owner || team.userPerms.manage_users)
                      "
                      class="flex flex-row justify-end"
                    >
                      <span
                        class="cursor-pointer text-gray-800 w-5 h-5 hover:text-gray-700 dark:text-white dark-hover:text-gray-400"
                        @click="editUser(user.user.id)"
                      >
                        <i class="fas fa-pen"></i>
                      </span>
                      <span
                        class="text-red-600 cursor-pointer w-5 h-5 hover:text-red-500"
                        @click="deleteUser(user.user.id)"
                      >
                        <i class="fas fa-trash"></i>
                      </span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <div
              v-if="pagination.last_page > 1"
              class="px-5 py-5 bg-white dark:bg-gray-800 flex flex-col xs:flex-row items-center xs:justify-between"
            >
              <span
                class="text-sm xs:text-sm text-gray-600 dark:text-gray-400 font-bold"
              >
                {{ `${pagination.current_page} / ${pagination.last_page}` }}
              </span>
              <div class="inline-flex mt-2 xs:mt-0">
                <button
                  class="px-4 py-2 border rounded-l-full border-r-0 focus:outline-none transition ease-out duration-300 border-green-400 hover:text-white hover:bg-green-400 w-32"
                  :disabled="pagination.current_page === pagination.first_page"
                  @click="previousPage"
                >
                  {{ $t('pages.teams.view.index.list.previous') }}
                </button>
                <button
                  class="px-4 py-2 border rounded-r-full border-l-0 focus:outline-none transition ease-out duration-300 border-green-400 hover:text-white hover:bg-green-400 w-32"
                  :disabled="pagination.current_page === pagination.last_page"
                  @click="nextPage"
                >
                  {{ $t('pages.teams.view.index.list.next') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="team.userPerms.owner || team.userPerms.manage_team"
        class="py-4 mt-10 text-center"
      >
        <t-button
          class="w-1/2 mb-8"
          icon="user-tag"
          color="gray-900"
          hover-color="white"
          bg-hover-color="gray-900"
          dark-bg-hover-color="white"
          dark-hover-color="gray-800"
          @click="$router.push('/teams/' + $route.params.id + '/roles')"
        >
          {{ $t('pages.teams.view.index.roles') }}
        </t-button>
        <t-button
          class="w-1/2"
          icon="trash"
          bg-hover-color="red-500"
          dark-bg-hover-color="red-500"
          @click="openDeleteTeamModal"
        >
          {{ $t('pages.teams.view.index.delete') }}
        </t-button>
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
          @click="deleteTeam"
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

    <t-modal
      v-if="Object.keys(searchModal).length > 0"
      @close-modal="searchModal = {}"
    >
      <h1 slot="title">{{ $t(searchModal.title) }}</h1>
      <div slot="actions">
        <div class="flex flex-col mb-4 text-left">
          <p class="mb-6">
            {{ $t('pages.team.view.index.add-user-info') }}
          </p>
          <t-input
            id="user-invite"
            v-model="usernameField"
            :label="$t('pages.teams.view.index.username')"
            icon="search"
            :error="$t(usernameError)"
            class="mb-2"
          />
        </div>
        <div class="flex flex-col">
          <t-button class="mb-2" @click="inviteUser">
            {{ $t('pages.team.view.index.invite-user') }}
          </t-button>
          <t-button
            class="mb-2"
            bg-hover-color="gray-900"
            dark-color="white"
            dark-bg-hover-color="white"
            dark-hover-color="gray-900"
            @click="searchModal = {}"
          >
            {{ $t('components.modal.close') }}
          </t-button>
        </div>
      </div>
    </t-modal>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'nuxt-property-decorator'
import { Context } from '@nuxt/types'
import TInput from '~/components/forms/TInput.vue'
import TTextarea from '~/components/forms/TTextarea.vue'
import TButton from '~/components/forms/TButton.vue'
import TModal from '~/components/bases/TModal.vue'

@Component({
  components: {
    TInput,
    TTextarea,
    TButton,
    TModal,
  },
})
export default class TeamViewIndex extends Vue {
  form: Partial<any> = {
    name: '',
    summary: '',
  }

  usernameField: string = ''
  usernameError: string = ''

  team: Partial<any> = {}
  errors: Partial<any> = {}
  errorMsg: string = ''
  page: number = 1

  deleteModal: Partial<any> = {}
  searchModal: Partial<any> = {}

  users: Array<Partial<any>> = []
  roles: Array<Partial<any>> = []
  pagination: Partial<any> = {}

  async asyncData({ params, redirect, $axios }: Context) {
    // Prevent error by checking if the params ID is a number
    if (params?.id?.match(/^[0-9]+$/)) {
      // Fetch the team information
      const team = await $axios.$get(`/api/teams/${params.id}`).catch(() => {
        // If the team is not found, then redirect the user
        return redirect('/teams/create')
      })

      return {
        team,
      }
    }
  }

  // Fetch users and roles of the current team
  async fetch() {
    const { users, roles } = await this.$axios
      .$get(`/api/teams/${this.$route.params.id}/users`, {
        params: {
          page: this.page,
        },
      })
      .catch(() => {
        return []
      })

    this.pagination = users.meta
    this.users = users.data
    this.roles = roles
  }

  mounted() {
    // Fill the form with the team informations
    this.form = this.team
  }

  // Check if the form is valid
  get formValid() {
    return this.form.name.length > 0 && this.form.summary.length > 0
  }

  editUser(_id: number) {}

  // Request action to delete an user from the team to the API
  deleteUser(id: number) {
    this.$axios
      .$delete(`/api/teams/${this.$route.params.id}/user`, {
        params: {
          id,
        },
      })
      .then(() => {
        // On success, reload the user list
        this.$fetch()
      })
      .catch((error) => {
        // If failed, log an error in the console
        // eslint-disable-next-line
        console.error(error)
      })
  }

  // Request action to search and invite an user in the team to the API
  inviteUser() {
    this.usernameError = ''
    // Request with the username field value
    this.$axios
      .$post(`/api/teams/${this.$route.params.id}/user`, {
        name: this.usernameField,
      })
      .then(() => {
        // On success, reload the user list and close the modal
        this.$fetch()
        this.searchModal = {}
      })
      .catch((error) => {
        // If failed check response status
        switch (error.response?.status) {
          // 409: conflict, the user already exist
          case 409:
            this.usernameError = 'error.form.unique'
            break
          // 422: data validation error
          case 422:
            this.usernameError = `error.form.${error.response.data.errors[0].rule}`
            break
        }
      })
  }

  // open the delete team modal confirmation
  openDeleteTeamModal() {
    this.deleteModal = {
      title: 'pages.teams.view.index.confirmDelete',
    }
  }

  // open the user invitation modal
  openSearchUserModal() {
    this.searchModal = {
      title: 'pages.teams.view.index.add-user-to-team',
    }
  }

  // Function called when the form is submited
  updateTeam() {
    this.errors = {}
    this.errorMsg = ''

    // Send a request to the API to update the team
    this.$axios
      .put('/api/teams', this.form)
      .then(async () => {
        // On success, fetch teams list and update it in the side bar
        const teams = await this.$axios.$get('/api/teams')
        await this.$store.commit(
          'menu/setList',
          teams.map((team: Partial<any>) => {
            return {
              name: team.name,
              path: `/teams/${team.id}`,
            }
          })
        )
      })
      .catch((error) => {
        // If failed, check the response status
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
            // unknown error
            default:
              this.errorMsg = 'error.unknown'
          }
        } else {
          // unknown error
          // eslint-disable-next-line
          console.error(error)
          this.errorMsg = 'error.unknown'
        }
      })
  }

  // Delete team action
  deleteTeam() {
    // Request the APi to delete the team
    this.$axios
      .delete(`/api/teams/${this.$route.params.id}`)
      .then(async () => {
        // On success, fetch teams list and update it
        const teams = await this.$axios.$get('/api/teams')
        await this.$store.commit(
          'menu/setList',
          teams.map((team: Partial<any>) => {
            return {
              name: team.name,
              path: `/teams/${team.id}`,
            }
          })
        )
        // Finally redirect the user to the main route
        this.$router.push('/teams')
      })
      .catch((error) => {
        // If failed, log the error in the console
        // eslint-disable-next-line
        console.error(error)
      })
  }

  // Next page function
  nextPage() {
    if (this.page < this.pagination.last_page) {
      this.page++
      this.$fetch()
    }
  }

  // Previous page function
  previousPage() {
    if (this.page > 1) {
      this.page--
      this.$fetch()
    }
  }

  @Watch('$route')
  onRouteChange(current: Partial<any>) {
    // On route change, if the page name still the same, then refetch team informations
    if (current.name === 'teams-id') {
      this.$fetch()
    }
  }
}
</script>
