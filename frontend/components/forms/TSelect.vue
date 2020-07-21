<template>
  <div>
    <label
      :for="id"
      class="block uppercase tracking-wide text-gray-600 dark:text-gray-400 font-bold mb-2"
    >
      {{ label }}
    </label>

    <div class="relative">
      <span
        v-if="icon"
        class="absolute inset-y-0 left-0 flex items-center pl-4"
      >
        <i
          class="fas text-gray-700 dark:text-gray-300 w-4 h-4"
          :class="'fa-' + icon"
        ></i>
      </span>

      <select
        :id="id"
        class="appearance-none w-full bg-gray-300 dark:bg-gray-900 rounded-full pl-10 py-2 px-4 placeholder-gray-700 dark-placeholder:text-gray-300 focus:outline-none text-black dark:text-white shadow focus:shadow-lg transition-shadow ease-out duration-700"
        :placeholder="label"
        :value="value"
        :disabled="disabled"
        @input="$emit('input', $event.target.value)"
      >
        <slot></slot>
      </select>
    </div>
    <p v-if="error" class="text-red-500 text-sm italic absolute ml-2">
      {{ error }}
    </p>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'
@Component
export default class TInput extends Vue {
  @Prop({ required: true })
  label!: string

  @Prop({ required: true })
  value!: string

  @Prop({ required: true })
  id!: string

  @Prop()
  icon!: string

  @Prop()
  error!: string

  @Prop({ type: Boolean })
  disabled!: boolean
}
</script>

<style lang="scss" scoped>
input:disabled {
  background-color: rgba(0, 0, 0, 0.1) !important;
}
</style>
