<template>
  <nav
    class="flex items-center justify-between flex-wrap px-4 py-2 bg-gray-800 text-white h-20"
  >
    <div class="flex items-center flex-shrink-0 text-grey-900 mr-6">
      <img
        src="~/assets/images/logo-1024.png"
        alt="App logo"
        class="h-16 w-16 mr-2"
      />
      <nuxt-link class="font-semibold text-xl tracking-thight" to="/">
        {{ $t('app-name') }}
      </nuxt-link>
    </div>
  </nav>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'

@Component
export default class NavBar extends Vue {}
</script>
