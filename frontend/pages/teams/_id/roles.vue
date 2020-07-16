<template>
  <div class="flex flex-row justify-center full-height">
    <div class="flex flex-col flex-1 p-4 overflow-y-auto">
      <span class="text-2xl text-gray-900 dark:text-white">
        <nuxt-link
          :to="'/teams/' + $route.params.id"
          class="mr-2 hover:text-green-400"
        >
          <i class="fas fa-arrow-left"></i>
        </nuxt-link>
        <h1 class="uppercase font-bold inline">
          {{ $t('pages.teams.view.roles.title', { name }) }}
        </h1>
      </span>

      <div class="flex flex-row mt-16 flex-1">
        <div class="md:border-r md:w-64 h-full">
          <div class="flex flex-col">
            <div class="flex flex-1 justify-between mb-4 px-2">
              <span class="font-sans uppercase font-bold">
                {{ $t('pages.teams.view.roles.roles') }}
              </span>
              <span
                class="cursor-pointer hover:text-gray-700 dark-hover:text-gray-200"
                @click="addRole"
              >
                <i class="fas fa-plus-circle"></i>
              </span>
            </div>
            <div
              v-for="(role, index) in roles"
              :key="index"
              class="flex-1 py-2 px-4 select-none cursor-pointer"
              :class="{ 'bg-green-400 text-white': selected == index }"
              @click="setRole(index)"
            >
              {{ role.name || 'default' }}
            </div>
          </div>
        </div>
        <div class="flex-1 p-10">
          <t-input
            id="role_name"
            v-model="form.name"
            :label="$t('pages.teams.view.roles.role_name')"
            class="mb-16 w-2/3 mx-auto"
            icon="user-tag"
            :disabled="form.name_disabled"
          />
          <t-checkbox
            id="manage_team"
            v-model="form.permission.manage_team"
            class="mb-8"
            :label="$t('roles.permissions.manage_teams.text')"
            :on-text="$t('roles.permissions.manage_teams.enabled')"
            :off-text="$t('roles.permissions.manage_teams.disabled')"
          />
          <t-checkbox
            id="manage_launchers"
            v-model="form.permission.manage_launchers"
            class="mb-8"
            :label="$t('roles.permissions.manage_launcher.text')"
            :on-text="$t('roles.permissions.manage_launcher.enabled')"
            :off-text="$t('roles.permissions.manage_launcher.disabled')"
          />
          <t-checkbox
            id="manage_modpacks"
            v-model="form.permission.manage_modpacks"
            class="mb-8"
            :label="$t('roles.permissions.manage_modpacks.text')"
            :on-text="$t('roles.permissions.manage_modpacks.enabled')"
            :off-text="$t('roles.permissions.manage_modpacks.disabled')"
          />
          <t-checkbox
            id="manage_users"
            v-model="form.permission.manage_users"
            class="mb-16"
            :label="$t('roles.permissions.manage_users.text')"
            :on-text="$t('roles.permissions.manage_users.enabled')"
            :off-text="$t('roles.permissions.manage_users.disabled')"
          />
          <div class="py-4 mt-10 text-center">
            <t-button icon="save" class="w-1/2 mb-4" @click="saveRole">
              {{ $t('pages.teams.view.roles.save') }}
            </t-button>
            <t-button
              icon="undo-alt"
              class="w-1/2 mb-4"
              bg-hover-color="red-500"
              dark-bg-hover-color="red-500"
              @click="resetRole"
            >
              {{ $t('pages.teams.view.roles.reset') }}
            </t-button>
            <t-button
              v-if="!form.name_disabled"
              icon="trash"
              class="w-1/2"
              bg-hover-color="red-500"
              dark-bg-hover-color="red-500"
              @click="deleteRole(selected)"
            >
              {{ $t('pages.teams.view.roles.delete') }}
            </t-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import { Context } from '@nuxt/types'
import cloneDeep from 'lodash/cloneDeep'
import TCheckbox from '~/components/forms/TCheckbox.vue'
import TInput from '~/components/forms/TInput.vue'
import TButton from '~/components/forms/TButton.vue'

@Component({
  components: {
    TCheckbox,
    TInput,
    TButton,
  },
})
export default class TeamRole extends Vue {
  name = ''

  selected: number = 0

  team: Partial<any> = {}

  roles: Array<Partial<any>> = []

  form: Partial<any> = {
    id: 0,
    team_id: 0,
    permission: {
      manage_team: false,
      manage_launchers: false,
      manage_modpacks: false,
      manage_users: false,
    },
  }

  errors: Partial<any> = {}
  errorMsg: string = ''

  async asyncData({ redirect, $axios, route }: Context) {
    // Fetch team information
    const team = await $axios
      .$get(`/api/teams/${route.params.id}`)
      .catch(() => {
        // If the team doesn't exist, redirect the user
        return redirect('/teams/create')
      })

    // Fetch the team roles
    const roles = await $axios
      .$get(`/api/teams/${route.params.id}/roles`)
      .catch(() => {
        // If failed, redirect the user
        return redirect('/teams/create')
      })

    return {
      team,
      roles,
    }
  }

  mounted() {
    // Set the page name
    this.name = this.team.name
    // Define a proper role list
    this.roles = [
      {
        name: 'default',
        name_disabled: true,
        permission: this.team.defaultPermission,
        team_id: this.$route.params.id,
      },
      ...this.roles,
    ]
    this.selected = 0
    // Fill the form informations form the role list
    this.form = cloneDeep(this.roles[this.selected])
  }

  // Called to render a specific role in the form
  setRole(index: number) {
    this.selected = index

    this.form = cloneDeep(this.roles[this.selected])
  }

  // When sumbmit, save the role informations
  saveRole() {
    this.$axios
      .put(`/api/teams/${this.$route.params.id}/roles`, this.form)
      .then(async () => {
        // On success, fetch role list and set the new role variable again
        this.roles = await this.$axios.$get(
          `/api/teams/${this.$route.params.id}/roles`
        )
        this.roles = [
          {
            name: 'default',
            name_disabled: true,
            permission: this.team.defaultPermission,
            team_id: this.$route.params.id,
          },
          ...this.roles,
        ]
      })
      .catch((error) => {
        // If failed, check the response status
        if (error.response?.status) {
          const parsedErrors: Partial<String> = {}
          switch (error.response.status) {
            // 422: data valitation error
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
            // Unknow error
            default:
              this.errorMsg = 'error.unknown'
          }
        } else {
          // Unknow error
          // eslint-disable-next-line
          console.error(error)
          this.errorMsg = 'error.unknown'
        }
      })
  }

  // Reset the role value to his initial state
  resetRole() {
    this.form = cloneDeep(this.roles[this.selected])
  }

  // Request the API to create a new role for the team
  addRole() {
    this.$axios
      .post(`/api/teams/${this.$route.params.id}/roles`)
      .then(async () => {
        // On success, fetch role list and set the role variable again
        this.roles = await this.$axios.$get(
          `/api/teams/${this.$route.params.id}/roles`
        )
        this.roles = [
          {
            name: 'default',
            name_disabled: true,
            permission: this.team.defaultPermission,
            team_id: this.$route.params.id,
          },
          ...this.roles,
        ]

        this.setRole(this.roles.length - 1)
      })
      .catch((error) => {
        // On failed, log the error in the console
        // eslint-disable-next-line
        console.log(error)
      })
  }

  // Request the API to delete a role from the team
  deleteRole(index: number) {
    this.$axios
      .delete(`/api/teams/${this.$route.params.id}/roles`, {
        params: {
          id: this.roles[index].id,
        },
      })
      .then(async () => {
        // On success, fetch role list and set the role variable again
        this.roles = await this.$axios.$get(
          `/api/teams/${this.$route.params.id}/roles`
        )
        this.roles = [
          {
            name: 'default',
            name_disabled: true,
            permission: this.team.defaultPermission,
            team_id: this.$route.params.id,
          },
          ...this.roles,
        ]

        this.setRole(index - 1)
      })
      .catch((error) => {
        // On failed, log the error in the console
        // eslint-disable-next-line
        console.log(error)
      })
  }
}
</script>
