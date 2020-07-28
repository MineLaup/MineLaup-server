<template>
  <div class="flex flex-row justify-center">
    <div class="flex-1 p-4 max-w-4xl">
      <h1 class="font-bold text-3xl text-gray-900 dark:text-white uppercase">
        {{ $t('pages.launchers.list.title') }}
      </h1>

      <div class="pt-5">
        <t-button icon="plus" @click="$router.push('/launchers/create')">
          {{ $t('pages.launchers.list.new') }}
        </t-button>

        <div
          v-for="team in teams"
          :key="team.id"
          class="pt-5 md:pt-5 md:p-10 pb-0 last:pb-10"
        >
          <h2 class="font-bold text-xl text-gray-900 dark:text-white uppercase">
            {{ team.name }}
          </h2>
          <div class="border dark:border-gray-800 flex flex-col m-5 mt-2">
            <nuxt-link
              v-for="launcher in team.launchers"
              :key="launcher.id"
              class="border-b dark:border-gray-800 last:border-b-0 p-4 hover:bg-gray-200 dark-hover:bg-gray-600 dark:bg-gray-800 cursor-pointer"
              :to="'/launchers/' + launcher.id"
            >
              {{ launcher.name }}
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import { Context } from '@nuxt/types'
import TButton from '~/components/forms/TButton.vue'

@Component({
  components: {
    TButton,
  },
})
export default class ModpackIndex extends Vue {
  // render modpack list
  async asyncData({ $axios }: Context) {
    // Fetch teams launchers
    let teams: Array<Partial<any>> = await $axios.$get('/api/launchers')

    teams = teams.filter((team: Partial<any>) => {
      return team.launchers?.length
    })

    return {
      teams,
    }
  }
}
</script>
