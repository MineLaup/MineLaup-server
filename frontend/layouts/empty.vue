<template>
  <div class="h-screen flex flex-col">
    <nuxt class="flex-1" />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'

@Component
export default class Empty extends Vue {}
</script>
