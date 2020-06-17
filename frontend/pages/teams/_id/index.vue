<template>
  <div class="flex flex-row justify-center">
    <div class="flex-1 p-4 max-w-4xl">
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
            icon="plus"
            type="submit"
            :disabled="!formValid"
          >
            {{ $t('pages.teams.view.index.update-btn') }}
          </t-button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import { Context } from '@nuxt/types'
import TInput from '~/components/forms/TInput.vue'
import TTextarea from '~/components/forms/TTextarea.vue'
import TButton from '~/components/forms/TButton.vue'

@Component({
  components: {
    TInput,
    TTextarea,
    TButton,
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

  async asyncData({ route, redirect, $axios }: Context) {
    if (!route.params?.id?.match(/^[0-9]+$/)) {
      return redirect('/teams/create')
    }

    const team = await $axios
      .$get(`/api/teams/${route.params.id}`)
      .catch(() => {
        return redirect('/teams/create')
      })

    return {
      team,
    }
  }

  mounted() {
    this.form = this.team
  }

  get formValid() {
    return this.form.name.length > 0 && this.form.summary.length > 0
  }
}
</script>
