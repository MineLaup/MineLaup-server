<template>
  <nuxt-child />
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import { Context } from '@nuxt/types'

@Component
export default class Launcher extends Vue {
  // set the side bar list
  async asyncData({ $axios, store }: Context) {
    // Fetch the team modpack
    let teams: Array<Partial<any>> = await $axios.$get('/api/launchers')

    store.commit('menu/clear')
    store.commit('menu/setTitle', 'layout.side-menu.launcher-title')
    store.commit('menu/setAdditional', {
      name: 'layout.side-menu.launcher-list',
      path: '/launchers',
      icon: 'list',
    })

    teams = teams.filter((team: Partial<any>) => {
      return team.launchers?.length
    })

    let launchers: Array<Partial<any>> = []

    teams.forEach((team: Partial<any>) => {
      launchers = launchers.concat(
        team.launchers.map((launcher: Partial<any>) => ({
          name: launcher.name,
          path: `/launchers/${launcher.id}`,
        }))
      )
    })

    if (teams) {
      store.commit('menu/setList', launchers)
    }
  }
}
</script>
