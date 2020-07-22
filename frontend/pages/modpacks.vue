<template>
  <nuxt-child />
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import { Context } from '@nuxt/types'

@Component
export default class Modpack extends Vue {
  // set the side bar list
  async asyncData({ $axios, store }: Context) {
    // Fetch the team modpacks
    let teams: Array<Partial<any>> = await $axios.$get('/api/modpacks')

    store.commit('menu/clear')
    store.commit('menu/setTitle', 'layout.side-menu.modpack-title')
    store.commit('menu/setAdditional', {
      name: 'layout.side-menu.modpack-new',
      path: '/modpacks/create',
      icon: 'plus',
    })

    teams = teams.filter((team: Partial<any>) => {
      return team.modpacks?.length
    })

    let modpacks: Array<Partial<any>> = []

    teams.forEach((team: Partial<any>) => {
      modpacks = modpacks.concat(
        team.modpacks.map((modpack: Partial<any>) => ({
          name: modpack.name,
          path: `/modpacks/${modpack.id}`,
        }))
      )
    })

    if (teams) {
      store.commit('menu/setList', modpacks)
    }
  }
}
</script>
