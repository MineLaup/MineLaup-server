<template>
  <div>
    <nuxt-child />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import { Context } from '@nuxt/types'

@Component
export default class Teams extends Vue {
  async asyncData({ $axios, store }: Context) {
    const teams = await $axios.$get('/api/teams')

    store.commit('menu/setTitle', 'layout.side-menu.team-title')
    store.commit('menu/setAdditional', {
      name: 'layout.side-menu.team-new',
      path: '/teams/create',
      icon: 'plus',
    })

    if (teams) {
      store.commit(
        'menu/setList',
        teams.map((team: Partial<any>) => {
          return {
            name: team.name,
            path: `/teams/${team.id}`,
          }
        })
      )
    }
  }
}
</script>
