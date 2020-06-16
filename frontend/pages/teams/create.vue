<template>
  <div class="flex flex-row">
    <div class="flex-1 p-4 max-w-4xl">
      <h1 class="font-bold text-3xl text-gray-900 uppercase">
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
    document.addEventListener('keypress', (event: KeyboardEvent) => {
      if (event.keyCode !== 10 || !event.ctrlKey) return

      this.createTeam()
    })
  }

  get formValid() {
    return this.form.name.length > 0 && this.form.summary.length > 0
  }

  createTeam() {
    this.errors = {}
    this.errorMsg = ''

    this.$axios
      .post('/api/teams', this.form)
      .then(({ data }) => {
        this.$router.push(`/teams/${data.id}`)
      })
      .catch((error) => {
        if (error.response?.status) {
          const parsedErrors: Partial<String> = {}
          switch (error.response.status) {
            case 400:
              this.errors = Object.assign({}, error.response.data.errors)
              break
            case 422:
              for (const e of error.response.data.errors) {
                parsedErrors[e.field] = `error.form.${e.rule}`
              }
              this.errors = parsedErrors
              break
            case 500:
              this.errorMsg = error.response.data.errors[0].message
              break
            default:
              this.errorMsg = 'error.unknown'
          }
        } else {
          // eslint-disable-next-line
          console.error(error)
          this.errorMsg = 'error.unknown'
        }
      })
  }
}
</script>
