<template>
  <div>
    {{ $route.params.id }}
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'

@Component
export default class ModpackView extends Vue {}
</script>
