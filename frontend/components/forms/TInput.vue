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
      <input
        :id="id"
        :type="currentType"
        class="appearance-none w-full bg-gray-300 dark:bg-gray-900 rounded-full pl-10 py-2 px-4 placeholder-gray-700 dark-placeholder:text-gray-300 focus:outline-none text-black dark:text-white shadow focus:shadow-lg transition-shadow ease-out duration-700"
        :class="{ 'pr-10': type === 'password' }"
        :placeholder="label"
        :value="value"
        :autocomplete="autocomplete"
        :max="max"
        :min="min"
        :disabled="disabled"
        @input="$emit('input', $event.target.value)"
      />
      <span
        v-if="type === 'password'"
        class="absolute inset-y-0 right-0 flex items-center pr-4 select-none"
      >
        <i
          class="fas text-gray-500 hover:text-gray-700 w-4 h-4 cursor-pointer"
          :class="'fa-eye' + (showPass ? '-slash' : '')"
          @click="showPass = !showPass"
        ></i>
      </span>
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

  @Prop({ default: 'text' })
  type!: string

  @Prop()
  error!: string

  showPass: boolean = false

  @Prop({ default: 'on' })
  autocomplete!: string

  @Prop()
  max!: number

  @Prop()
  min!: number

  @Prop({ type: Boolean })
  disabled!: boolean

  get currentType() {
    if (this.type === 'password') {
      return this.showPass ? 'text' : 'password'
    } else {
      return this.type
    }
  }
}
</script>

<style lang="scss" scoped>
input:disabled {
  background-color: rgba(0, 0, 0, 0.1) !important;
}
</style>
