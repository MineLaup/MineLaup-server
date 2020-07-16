<template>
  <nuxt-link
    class="cursor-pointer px-4 py-3 transition-colors ease-out duration-100 block"
    :class="{
      'bg-green-400 text-white': isCurrentRoute,
      'hover:bg-gray-800': !isCurrentRoute,
    }"
    :to="to"
  >
    <slot></slot>
  </nuxt-link>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'

@Component
export default class TSideBarItem extends Vue {
  @Prop({ required: true })
  to!: string

  @Prop({ default: false, type: Boolean })
  exact!: boolean

  // Getter used to obtain the current route
  get isCurrentRoute() {
    if (this.exact) {
      return this.$route.path === this.to
    } else {
      return this.$route.path.startsWith(this.to)
    }
  }
}
</script>
