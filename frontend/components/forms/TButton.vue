<template>
  <button
    class="px-4 py-2 border rounded-full focus:outline-none transition ease-out duration-300"
    :class="[
      'border-' + bgHoverColor,
      'dark:border-' + darkBgHoverColor,
      {
        'border-gray-600 text-gray-500 cursor-auto': disabled,
        [currentColor]: !disabled,
      },
    ]"
    :disabled="disabled"
    :type="type"
    @click="$emit('click')"
  >
    <i
      v-if="icon"
      class="fas w-4 h-4 mr-2"
      :class="[
        !disabled ? 'hover:text-' + hoverColor : '',
        'fa-' + icon,
        {
          'border-gray-600 text-gray-500 cursor-auto': disabled,
          [' hover:text-' + hoverColor]: !disabled,
        },
      ]"
    ></i>
    <slot></slot>
  </button>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'
@Component
export default class Button extends Vue {
  @Prop({ default: 'white' })
  hoverColor!: String

  @Prop({ default: 'white' })
  darkHoverColor!: String

  @Prop({ default: 'green-400' })
  bgHoverColor!: string

  @Prop({ default: 'green-400' })
  darkBgHoverColor!: string

  @Prop({ default: 'transparent' })
  bgColor!: string

  @Prop({ default: 'transparent' })
  darkBgColor!: string

  @Prop({ default: 'gray-900' })
  color!: string

  @Prop({ default: 'white' })
  darkColor!: string

  @Prop()
  disabled!: boolean

  @Prop()
  icon!: string

  @Prop()
  type!: string

  get currentColor() {
    return `text-${this.color} bg-${this.bgColor} hover:bg-${this.bgHoverColor} hover:text-${this.hoverColor} dark:text-${this.darkColor} dark:bg-${this.darkBgColor} dark-hover:bg-${this.darkBgHoverColor} dark-hover:text-${this.darkHoverColor}`
  }
}
</script>

<style lang="scss" scoped>
button:disabled {
  background-color: rgba(255, 255, 255, 0.1) !important;
}
</style>
