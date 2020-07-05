<template>
  <div class="flex flex-row justify-center">
    <div class="flex-1 p-4 max-w-4xl overflow-y-auto">
      <form
        ref="create_team_form"
        class="p-10 items-center"
        @submit.prevent="createTeam"
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
        />

        <t-textarea
          id="summary"
          v-model="form.summary"
          icon="info-circle"
          :label="$t('pages.teams.view.index.summary')"
          :error="errors.summary ? $t(errors.summary) : ''"
        >
        </t-textarea>

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

      <div>
        <h2
          class="text-xl font-semibold leading-tight uppercase text-gray-900 dark:text-white py-4"
        >
          {{ $t('pages.teams.view.index.users') }}
        </h2>

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
                          <i class="fas fa-crown text-yellow-500"></i>
                        </p>
                      </div>
                    </div>
                  </td>
                  <td
                    class="px-5 py-5 border-b border-gray-200 dark:border-gray-800 bg-white text-sm dark:bg-gray-800"
                  >
                    <p class="text-gray-900 whitespace-no-wrap dark:text-white">
                      {{ user.teamRole.name }}
                    </p>
                  </td>
                  <td
                    class="px-10 py-5 border-b border-gray-200 dark:border-gray-800 bg-white text-sm text-right dark:bg-gray-800"
                  >
                    <div
                      v-if="team.owner_id !== user.user.id"
                      class="flex flex-row justify-end"
                    >
                      <span
                        class="cursor-pointer text-gray-800 w-5 h-5 hover:text-gray-700"
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
                    <div v-else class="text-gray-700 italic dark:text-gray-300">
                      {{ $t('pages.teams.view.index.list.cant-edit-self') }}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <div
              v-if="pagination.total > 1"
              class="px-5 py-5 bg-white border-t flex flex-col xs:flex-row items-center xs:justify-between"
            >
              <span class="text-xs xs:text-sm text-gray-900">
                {{ `${pagination.current_page}/${pagination.total}` }}
              </span>
              <div class="inline-flex mt-2 xs:mt-0">
                <button
                  class="px-4 py-2 border rounded-l-full border-r-0 focus:outline-none transition ease-out duration-300 border-green-400 hover:text-white hover:bg-green-400 w-32"
                >
                  {{ $t('pages.teams.view.index.list.previous') }}
                </button>
                <button
                  class="px-4 py-2 border rounded-r-full border-l-0 focus:outline-none transition ease-out duration-300 border-green-400 hover:text-white hover:bg-green-400 w-32"
                >
                  {{ $t('pages.teams.view.index.list.next') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="$auth.user.id === team.owner_id"
        class="py-4 mt-10 text-center"
      >
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
    <t-modal v-if="Object.keys(modal).length > 0" @close-modal="modal = {}">
      <h1 slot="title">{{ $t(modal.title) }}</h1>
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
          @click="modal = {}"
        >
          {{ $t('components.modal.no') }}
        </t-button>
      </div>
    </t-modal>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
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

  team: Partial<any> = {}
  errors: Partial<any> = {}
  errorMsg: string = ''

  modal: Partial<any> = {}

  users: Array<Partial<any>> = []
  pagination: Partial<any> = {}

  async asyncData({ route, redirect, $axios }: Context) {
    if (!route.params?.id?.match(/^[0-9]+$/)) {
      return redirect('/teams/create')
    }

    const team = await $axios
      .$get(`/api/teams/${route.params.id}`)
      .catch(() => {
        return redirect('/teams/create')
      })

    const { users, roles } = await $axios
      .$get(`/api/teams/${route.params.id}/users`)
      .catch(() => {
        return []
      })

    return {
      team,
      pagination: users.meta,
      users: users.data,
      roles,
    }
  }

  mounted() {
    this.form = this.team
  }

  get formValid() {
    return this.form.name.length > 0 && this.form.summary.length > 0
  }

  editUser(_id: number) {}

  deleteUser(_id: number) {}

  openDeleteTeamModal() {
    this.modal = {
      title: 'pages.teams.view.index.confirmDelete',
    }
  }

  deleteTeam() {
    this.$axios
      .delete(`/api/teams/${this.$route.params.id}`)
      .then(async () => {
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
        this.$router.push('/teams')
      })
      .catch((error) => {
        console.error(error)
      })
  }
}
</script>
