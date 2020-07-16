<template>
  <div class="flex flex-row justify-center">
    <div class="flex-1 p-4 max-w-4xl">
      <h1 class="font-bold text-3xl text-gray-900 dark:text-white uppercase">
        {{ $t('pages.teams.create.title') }}
      </h1>

      <form
        ref="create_team_form"
        class="p-10 items-center"
        @submit.prevent="createTeam"
      >
        <t-alert v-if="errorMsg" :message="$t(errorMsg)" />

        <t-input
          id="name"
          v-model="form.name"
          :label="$t('pages.teams.create.name')"
          icon="user-friends"
          class="w-2/3 mb-4"
          autocomplete="off"
          :error="errors.name ? $t(errors.name) : ''"
        />

        <t-textarea
          id="summary"
          v-model="form.summary"
          icon="info-circle"
          :label="$t('pages.teams.create.summary')"
          :error="errors.summary ? $t(errors.summary) : ''"
        >
        </t-textarea>

        <div class="text-center mt-4">
          <t-button
            class="w-1/2"
            icon="plus"
            type="submit"
            :disabled="!formValid"
          >
            {{ $t('pages.teams.create.submit') }}
          </t-button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import TButton from '~/components/forms/TButton.vue'
import TTextarea from '~/components/forms/TTextarea.vue'
import TInput from '~/components/forms/TInput.vue'
import TAlert from '~/components/bases/TAlert.vue'

@Component({
  components: {
    TButton,
    TTextarea,
    TInput,
    TAlert,
  },
})
export default class TeamCreate extends Vue {
  errorMsg: string = ''

  form = {
    name: '',
    summary: '',
  }

  errors: Partial<String> = {}

  mounted() {
    // Submit the form when the user press CTRL+ENTER
    document.addEventListener('keypress', (event: KeyboardEvent) => {
      if (event.keyCode !== 10 || !event.ctrlKey) return

      this.createTeam()
    })
  }

  // Check if the form is valid
  get formValid() {
    return this.form.name.length > 0 && this.form.summary.length > 0
  }

  // Called when the form is submited
  createTeam() {
    this.errors = {}
    this.errorMsg = ''

    // Request the API to create a new team
    this.$axios
      .post('/api/teams', this.form)
      .then(async ({ data }) => {
        // On success, fetch teams list and update it in side bar
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
        // Redirect the user to the new team page
        this.$router.push(`/teams/${data.id}`)
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
