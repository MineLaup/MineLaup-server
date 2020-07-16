<template>
  <div>
    <nuxt-child />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import { Context } from '@nuxt/types'

@Component
export default class AdminView extends Vue {
  // Update the side bar list
  asyncData({ store }: Context) {
    store.commit('menu/clear')
    store.commit('menu/setTitle', 'layout.side-menu.administration-title')
    store.commit('menu/setList', [
      {
        nameI18n: 'layout.side-menu.users',
        path: '/admin/users',
      },
      {
        nameI18n: 'layout.side-menu.settings',
        path: '/admin/settings',
      },
    ])
  }
}
</script>
