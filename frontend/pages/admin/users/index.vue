<template>
  <div class="flex flex-row justify-center">
    <div class="flex-1 p-4 max-w-4xl overflow-y-auto">
      <h1 class="text-2xl uppercase text-gray-900 dark:text-white font-bold">
        {{ $t('pages.admin.users.title') }}
      </h1>

      <div class="my-4 flex flex-row max-w-xl mx-auto">
        <t-button icon="plus" @click="$router.push('/admin/users/create')">
          {{ $t('pages.admin.users.new-user') }}
        </t-button>
      </div>

      <div class="mt-4 mb-8 flex flex-row shadow rounded-full max-w-xl mx-auto">
        <div class="relative w-32">
          <select
            v-model="search.limit"
            class="appearance-none w-full bg-gray-300 dark:bg-gray-900 rounded-full rounded-r-none pl-10 py-2 px-4 placeholder-gray-700 dark-placeholder:text-gray-300 focus:outline-none text-black dark:text-white transition-shadow ease-out duration-700 focus:shadow-lg"
            @input="searchUsers"
          >
            {{ /* eslint-disable-next-line vue-i18n/no-raw-text */ }}
            <option value="10" selected>10</option>
            {{ /* eslint-disable-next-line vue-i18n/no-raw-text */ }}
            <option value="20">20</option>
            {{ /* eslint-disable-next-line vue-i18n/no-raw-text */ }}
            <option value="50">50</option>
          </select>
          <span
            class="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none"
          >
            <i class="fas fa-caret-down text-gray-500 w-4 h-4"></i>
          </span>
        </div>
        <div class="relative w-full">
          <span class="absolute inset-y-0 left-0 flex items-center pl-4">
            <i class="fas text-gray-700 w-4 h-4 fa-search"></i>
          </span>
          <input
            v-model="search.text"
            type="text"
            class="appearance-none w-full bg-gray-300 dark:bg-gray-900 rounded-full rounded-l-none pl-10 py-2 px-4 placeholder-gray-700 dark-placeholder:text-gray-300 focus:outline-none text-black dark:text-white transition-shadow ease-out duration-700 focus:shadow-lg"
            :placeholder="$t('pages.admin.users.search')"
            @input="searchUsers"
          />
        </div>
      </div>

      <div v-if="users && pagination" class="overflow-x-auto">
        <div class="inline-block min-w-full overflow-hidden">
          <table class="min-w-full leading-normal rounded-lg">
            <thead>
              <tr>
                <th
                  class="w-1/5 px-5 py-3 border-b-2 border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-900 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider"
                >
                  {{ $t('pages.admin.users.list.username') }}
                </th>
                <th
                  class="w-4 px-5 py-3 border-b-2 border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-900 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider"
                >
                  {{ $t('pages.admin.users.list.role') }}
                </th>
                <th
                  class="w-1/4 px-5 py-3 border-b-2 border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-900 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider"
                >
                  {{ $t('pages.admin.users.list.email') }}
                </th>
                <th
                  class="w-2 px-5 py-3 border-b-2 border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-900 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider"
                >
                  {{ $t('pages.admin.users.list.state') }}
                </th>
                <th
                  class="w-1/5 px-5 py-3 border-b-2 border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-900 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider text-right"
                >
                  {{ $t('pages.admin.users.list.actions') }}
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
                        {{ user.username }}
                      </p>
                    </div>
                  </div>
                </td>
                <td
                  class="px-5 py-5 border-b border-gray-200 dark:border-gray-800 text-sm"
                >
                  <p class="text-gray-900 whitespace-no-wrap dark:text-white">
                    {{ user.role }}
                  </p>
                </td>
                <td
                  class="px-5 py-5 border-b border-gray-200 dark:border-gray-800 text-sm"
                >
                  <p class="text-gray-900 whitespace-no-wrap dark:text-white">
                    {{ user.email }}
                  </p>
                </td>
                <td
                  class="px-5 py-5 border-b border-gray-200 dark:border-gray-800 text-sm"
                >
                  <p
                    class="text-gray-900 whitespace-no-wrap dark:text-white select-none"
                    :class="{
                      'hover:text-green-600 dark-hover:text-green-400 cursor-pointer':
                        $auth.user.id !== user.id,
                    }"
                    @click="
                      $auth.user.id === user.id
                        ? () => {}
                        : toggleState(user.id, user.disabled)
                    "
                  >
                    {{
                      user.disabled
                        ? $t('pages.admin.users.list.disabled')
                        : $t('pages.admin.users.list.active')
                    }}
                  </p>
                </td>
                <td
                  class="px-10 py-5 border-b border-gray-200 dark:border-gray-800 text-sm text-right"
                >
                  <div class="flex flex-row justify-end">
                    <nuxt-link
                      class="cursor-pointer text-gray-800 dark:text-gray-200 w-5 h-5 hover:text-gray-600 dark-hover:text-green-400"
                      :to="'/admin/users/' + user.id"
                      @click="editUser(user.id)"
                    >
                      <i class="fas fa-pen"></i>
                    </nuxt-link>
                    <span
                      v-if="user.id !== $auth.user.id"
                      class="text-red-600 cursor-pointer w-5 h-5 hover:text-red-500"
                      @click="openDeleteModal(user)"
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
    <t-modal
      v-if="Object.keys(modal).length > 0 && selected"
      @close-modal="closeDeleteModal"
    >
      <h1 slot="title">{{ $t(modal.title, { username: modal.user }) }}</h1>
      <div slot="actions" class="flex flex-col">
        <t-button
          class="mb-2"
          bg-hover-color="red-500"
          dark-bg-hover-color="red-500"
          @click="deleteUser(selected)"
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
import debounce from 'lodash/debounce'
import TModal from '~/components/bases/TModal.vue'
import TButton from '~/components/forms/TButton.vue'
import TInput from '~/components/forms/TInput.vue'

@Component({
  components: {
    TModal,
    TButton,
    TInput,
  },
  middleware: ['admin'],
})
export default class AdminUsersView extends Vue {
  users: Partial<any>[] = []
  pagination: Partial<any> = {}

  modal = {}
  selected: number | null = null

  search = {
    text: '',
    limit: 10,
    page: 1,
  }

  async fetch() {
    // Fetch the user list from the search informations
    const response = await this.$axios.$get('/api/admin/users', {
      params: this.search,
    })

    const { data, meta } = response

    this.users = data
    this.pagination = meta
  }

  editUser(_id: number) {}

  // The delete user modal is opened when this function is called
  openDeleteModal(user: Partial<any>) {
    this.modal = {
      title: 'pages.admin.users.confirmDelete',
      user: user.username,
    }
    this.selected = user.id
  }

  // Request the delete action of an user to the API
  deleteUser(id: number) {
    this.$axios
      .delete('/api/admin/user', {
        params: {
          id,
        },
      })
      .then(() => {
        // On success, reload the user list and close the modal
        this.$fetch()
        this.modal = {}
      })
      .catch((error) => {
        // if failed, log the error
        // eslint-disable-next-line
        console.log(error)
      })
  }

  // Close the delete modal when called
  closeDeleteModal() {
    this.selected = null
    this.modal = {}
  }

  // Toggle the user state between `activated` and `disabled`
  toggleState(id: number, isDisabled: boolean) {
    this.$axios
      .post(
        '/api/admin/user/state',
        {
          state: isDisabled,
        },
        {
          params: {
            id,
          },
        }
      )
      .then(() => {
        // On sucess, update informations on screen to give a feedback to the user
        const index = this.users.findIndex((user) => user.id === id)
        this.users[index].disabled = !isDisabled
      })
  }

  // Decounced function to search users
  searchUsers = debounce(() => {
    this.search.page = 1
    this.$fetch()
  }, 250)

  // Next page function
  nextPage() {
    if (this.search.page < this.pagination.last_page) {
      this.search.page++
      this.$fetch()
    }
  }

  // Previous page function
  previousPage() {
    if (this.search.page > 1) {
      this.search.page--
      this.$fetch()
    }
  }
}
</script>
