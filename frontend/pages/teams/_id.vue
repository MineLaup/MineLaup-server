<template>
  <nuxt-child />
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import { Context } from '@nuxt/types'

@Component
export default class TeamView extends Vue {
  asyncData({ redirect, params }: Context) {
    // If the ID param is not a number, redirect the user
    if (!params?.id?.match(/^[0-9]+$/)) {
      return redirect('/teams/create')
    }
  }
}
</script>
