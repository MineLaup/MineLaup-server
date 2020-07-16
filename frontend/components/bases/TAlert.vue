<template>
  <div class="px-10 w-full md:1/3 mx-auto mb-6">
    <div
      class="flex items-center bg-red-500 text-white text-sm font-bold px-4 py-3"
      :class="{
        'bg-red-500': type === 'error',
        'bg-yellow-600': type === 'warn',
        'bg-green-500': type === 'success',
      }"
      role="alert"
    >
      <i
        class="fas w-4 h-4 mr-2"
        :class="{
          'fa-exclamation-circle': type === 'error',
          'fa-exclamation-triangle': type === 'warn',
          'fa-check-circle': type === 'success',
        }"
      ></i>
      <p>{{ message }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'

@Component
export default class TAlert extends Vue {
  @Prop()
  message!: string

  // Type of the alert. It can be a `warn`, an `error` or a `success`
  @Prop({
    default: 'error',
    validator: (type) => ['warn', 'error', 'success'].includes(type),
  })
  type!: string
}
</script>
