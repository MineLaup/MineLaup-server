<template>
  <div class="flex flex-row justify-center">
    <div class="flex-1 p-4 max-w-4xl">
      <h1 class="font-bold text-3xl text-gray-900 dark:text-white uppercase">
        {{ $t('pages.launchers.create.title') }}
      </h1>

      <form
        ref="create_team_form"
        class="p-10 items-center"
        @submit.prevent="createLauncher"
      >
        <t-alert v-if="errorMsg" :message="$t(errorMsg)" />

        <t-input
          id="name"
          v-model="form.name"
          :label="$t('pages.launchers.create.name')"
          icon="user-friends"
          class="w-2/3 mb-4"
          autocomplete="off"
          :error="errors.name ? $t(errors.name) : ''"
        />

        <t-textarea
          id="summary"
          v-model="form.summary"
          icon="info-circle"
          :label="$t('pages.launchers.create.summary')"
          :error="errors.summary ? $t(errors.summary) : ''"
        >
        </t-textarea>

        <t-select
          id="team"
          v-model="form.team_id"
          :label="$t('pages.launchers.create.team')"
          icon="users"
          :error="errors.team_id ? $t(errors.team_id) : ''"
        >
          <option value="default" disabled>
            {{ $t('pages.launchers.create.select_team') }}
          </option>
          <option v-for="team in teams" :key="team.id" :value="team.id">
            {{ team.name }}
          </option>
        </t-select>

        <div class="text-center mt-4">
          <t-button
            class="w-1/2"
            icon="plus"
            type="submit"
            :disabled="!formValid"
          >
            {{ $t('pages.launchers.create.submit') }}
          </t-button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import { Context } from '@nuxt/types'
import TButton from '~/components/forms/TButton.vue'
import TTextarea from '~/components/forms/TTextarea.vue'
import TInput from '~/components/forms/TInput.vue'
import TAlert from '~/components/bases/TAlert.vue'
import TSelect from '~/components/forms/TSelect.vue'

@Component({
  components: {
    TButton,
    TTextarea,
    TInput,
    TAlert,
    TSelect,
  },
})
export default class ModpackCreate extends Vue {
  errorMsg: string = ''

  form = {
    name: '',
    summary: '',
    team_id: 'default',
  }

  teams: Array<Partial<any>> = []

  errors: Partial<String> = {}

  async asyncData({ $axios }: Context) {
    // Fetch teams from the API
    const teams = await $axios.$get('/api/teams')

    return {
      teams,
    }
  }

  mounted() {
    // Submit the form when the user press CTRL+ENTER
    document.addEventListener('keypress', (event: KeyboardEvent) => {
      if (event.keyCode !== 10 || !event.ctrlKey) return

      this.createLauncher()
    })
  }

  // Check if the form is valid
  get formValid() {
    return this.form.name.length > 0 && this.form.team_id.match(/^[0-9]+$/)
  }

  // Called when the form is submited
  createLauncher() {
    this.errors = {}
    this.errorMsg = ''

    // Request the API to create a new launcher
    this.$axios
      .post('/api/launchers', this.form)
      // eslint-disable-next-line
      .then(async ({ data }) => {
        // On success, fetch teams list and update modpack list it in side bar
        let teams: Array<Partial<any>> = await this.$axios.$get(
          '/api/launchers'
        )

        teams = teams.filter((team: Partial<any>) => {
          return team.launchers?.length
        })

        const launchers: Array<Partial<any>> = []

        teams.map((team: Partial<any>) => {
          team.launchers.map((launcher: Partial<any>) => {
            launchers.push({
              name: launcher.name,
              path: `/launchers/${launcher.id}`,
            })
          })
        })

        if (teams) {
          this.$store.commit('menu/setList', launchers)
        }
        // Redirect the user to the new launcher page
        this.$router.push(`/launchers/${data.id}`)
      })
      .catch((error) => {
        // On failed, check the response state
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
            // Unknown error
            default:
              this.errorMsg = 'error.unknown'
          }
        } else {
          // Unknown error
          // eslint-disable-next-line
          console.error(error)
          this.errorMsg = 'error.unknown'
        }
      })
  }
}
</script>
