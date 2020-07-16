<template>
  <li
    class="relative"
    @mouseenter="showTitle = true"
    @mouseleave="showTitle = false"
  >
    <nuxt-link
      class="text-white w-12 h-10 flex hover:text-green-400 cursor-pointer md:border-l-2 md:border-t-0 border-t-2 border-transparent"
      :to="to"
      :class="{ 'border-green-400 text-green-400': isCurrentRoute }"
    >
      <span class="m-auto text-xl">
        <i class="fas" :class="'fa-' + icon"></i>
      </span>
    </nuxt-link>
    <span
      v-if="showTitle"
      class="absolute bg-gray-800 px-1 rounded top-0 left-0 mt-10 md:mt-2 md:ml-12 z-20 whitespace-no-wrap select-none"
    >
      {{ name }}
    </span>
  </li>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'
@Component
export default class TSideBarButton extends Vue {
  @Prop({ required: true })
  name!: string

  @Prop({ required: true })
  icon!: string

  @Prop({ required: true })
  to!: string

  @Prop()
  exact!: boolean

  showTitle: boolean = false

  // Getter used to obtain the current route
  get isCurrentRoute() {
    if (this.exact) {
      return this.$route.path === this.to
    }
    return this.$route.path.startsWith(this.to)
  }
}
</script>
