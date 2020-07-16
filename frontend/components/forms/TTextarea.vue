<template>
  <div>
    <label
      :for="id"
      class="block uppercase tracking-wide text-gray-600 dark:text-gray-400 font-bold mb-2"
    >
      {{ label }}
    </label>

    <div class="relative">
      <span v-if="icon" class="absolute inset-y-0 left-0 top-0 flex pt-3 pl-4">
        <i
          class="fas text-gray-700 dark:text-gray-300 w-4 h-4"
          :class="'fa-' + icon"
        ></i>
      </span>
      <textarea
        :id="id"
        :placeholder="label"
        :value="value"
        :autocomplete="autocomplete"
        class="appearance-none w-full bg-gray-300 dark:bg-gray-900 rounded-lg pl-10 py-2 px-4 placeholder-gray-700 dark-placeholder:text-gray-300 focus:outline-none text-black dark:text-white shadow focus:shadow-lg transition-shadow ease-out duration-700 min-h-1"
        :cols="cols"
        :rows="rows"
        :disabled="disabled"
        @input="$emit('input', $event.target.value)"
      ></textarea>
    </div>
    <p v-if="error" class="text-red-500 text-sm italic absolute">
      {{ error }}
    </p>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'
import autosize from 'autosize'
@Component
export default class TTextarea extends Vue {
  @Prop({ required: true })
  label!: string

  @Prop({ required: true })
  value!: string

  @Prop({ required: true })
  id!: string

  @Prop()
  icon!: string

  @Prop({ default: '30' })
  cols!: number

  @Prop({ default: '5' })
  rows!: number

  @Prop()
  error!: string

  @Prop({ default: 'on' })
  autocomplete!: string

  @Prop({ default: true, type: Boolean })
  autoResize!: boolean

  @Prop({ type: Boolean })
  disabled!: boolean

  mounted() {
    // Activate the autoresize script if the props `autoResize` is enabled
    if (this.autoResize) {
      autosize(this.$el.querySelector('textarea') as Element)
    }
  }
}
</script>

<style lang="scss" scoped>
textarea:disabled {
  background-color: rgba(0, 0, 0, 0.1) !important;
}
</style>
