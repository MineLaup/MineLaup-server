<template>
  <div
    class="fixed top-0 left-0 z-20 w-full h-screen flex flex-row justify-center items-center bg-gray-800 bg-opacity-75 transition-all ease-out duration-300"
  >
    <div
      class="bg-white dark:bg-gray-900 dark:text-white rounded shadow p-8 max-w-xl text-center flex-1"
    >
      <div class="mb-4 text-2xl font-bold">
        <slot name="title"></slot>
      </div>
      <div class="mb-8 text-justify">
        <slot name="description"></slot>
      </div>
      <div>
        <slot name="actions"></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'

@Component
export default class TModal extends Vue {
  mounted() {
    // When the component is mounted, if the user click outside the modal then a `close-modal` event is emitted
    const el: Element = document.querySelector('.bg-opacity-75') as Element
    el.addEventListener('click', (event: any) => {
      if (event?.target.classList.contains('bg-opacity-75')) {
        this.$emit('close-modal')
      }
    })
  }
}
</script>
