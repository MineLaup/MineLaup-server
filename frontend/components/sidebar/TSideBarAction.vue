<template>
  <li
    class="md:relative"
    @mouseenter="showTitle = true"
    @mouseleave="showTitle = false"
  >
    <a
      class="text-white w-12 h-10 flex hover:text-green-400 cursor-pointer border-l-2 border-transparent"
      @click="$emit('click')"
    >
      <span class="m-auto text-xl">
        <i class="fas" :class="'fa-' + icon"></i>
      </span>
    </a>
    <span
      v-if="showTitle"
      class="absolute bg-gray-800 px-1 m-0 rounded left-0 md:top-0 sm:mt-2 sm:ml-12 w-full md:w-auto z-20 whitespace-no-wrap select-none"
    >
      {{ name }}
    </span>
  </li>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'
@Component
export default class TSideBarAction extends Vue {
  @Prop({ required: true })
  name!: string

  @Prop({ required: true })
  icon!: string

  showTitle: boolean = false
}
</script>
