<template>
  <div class="flex flex-row justify-center">
    <div class="flex-1 p-4 max-w-4xl">
      <h1 class="font-bold text-3xl text-gray-900 dark:text-white uppercase">
        {{ $t('pages.modpacks.list.title') }}
      </h1>

      <div v-for="team in teams" :key="team.id" class="p-10 pb-0 last:pb-10">
        <h2 class="font-bold text-xl text-gray-900 dark:text-white uppercase">
          {{ team.name }}
        </h2>
        <div class="border dark:border-gray-800 flex flex-col m-5 mt-2">
          <nuxt-link
            v-for="modpack in team.modpacks"
            :key="modpack.id"
            class="border-b dark:border-gray-800 last:border-b-0 p-4 hover:bg-gray-200 dark-hover:bg-gray-600 dark:bg-gray-800 cursor-pointer"
            :to="'/modpacks/' + modpack.id"
          >
            {{ modpack.name }}
          </nuxt-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import { Context } from '@nuxt/types'

@Component
export default class ModpackIndex extends Vue {
  // render modpack list
  async asyncData({ $axios }: Context) {
    // Fetch teams modpacks
    let teams: Array<Partial<any>> = await $axios.$get('/api/modpacks')

    teams = teams.filter((team: Partial<any>) => {
      return team.modpacks?.length
    })

    return {
      teams,
    }
  }
}
</script>
