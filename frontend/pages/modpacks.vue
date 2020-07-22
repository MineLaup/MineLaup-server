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
    // eslint-disable-next-line
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

    if (teams) {
      store.commit(
        'menu/setList',
        teams.map((team: Partial<any>) => {
          return team.modpacks.map((modpack: Partial<any>) => ({
            name: modpack.name,
            path: `/modpacks/${modpack.id}`,
          }))
        })
      )
    }
  }
}
</script>
