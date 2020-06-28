<template>
  <div>
    <nuxt-child />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component({
  middleware: ['admin'],
})
export default class AdminUsers extends Vue {}
</script>
