<template>
  <div class="flex">
    <nuxt-child class="mods-height"></nuxt-child>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
@Component
export default class ModpackViewMods extends Vue {}
</script>

<style lang="scss" scoped>
.mods-height {
  height: calc(100vh - 5rem - 3rem - 16rem);
}
</style>
