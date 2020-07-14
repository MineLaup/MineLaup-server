<template>
  <div>
    <label
      :for="id"
      class="block uppercase tracking-wide text-gray-600 dark:text-gray-400 font-bold mb-2"
    >
      {{ label }}
    </label>

    <div class="relative flex flex-row align-middle select-none items-center">
      <input
        :id="id"
        :checked="value"
        type="checkbox"
        class="inline-block w-6 h-6 mr-2 rounded-full border-2 appearance-none cursor-pointer outline-none text-green-400 transition duration-200 ease-in shadow"
        @input="$emit('input', $event.target.checked)"
      />
      <label :for="id" class="toggle-label inline rounded-full cursor-pointer">
        {{ `${value ? onText : offText}` }}
      </label>
    </div>
    <p v-if="error" class="text-red-500 text-xs italic absolute">
      {{ error }}
    </p>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'

@Component
export default class TCheckbox extends Vue {
  @Prop({ required: true })
  label!: string

  @Prop({ default: false })
  value!: boolean

  @Prop({ required: true })
  id!: string

  @Prop()
  error!: string

  @Prop()
  onText!: string

  @Prop()
  offText!: string
}
</script>

<style lang="scss" scoped>
$fa-font-path: '~@fortawesome/fontawesome-free/webfonts' !default;
@import '~@fortawesome/fontawesome-free/scss/fontawesome';
@import '~@fortawesome/fontawesome-free/scss/solid';

input[type='checkbox'] {
  @extend %fa-icon;
  @extend .fas;

  &::before {
    content: '';
    position: absolute;
    display: block;
    top: 6px;
    left: 6px;
    font-size: 12px;
    transition-duration: 300ms !important;
    transition-timing-function: ease-in !important;
    transition-property: all !important;
    transform: rotate(100deg) scale(0);
  }

  &::after {
    position: absolute;
    border: #68d391 solid 0;
    content: '';
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 9999px;
    top: 0;
    left: 0;
  }

  &:checked {
    &::before {
      content: fa-content($fa-var-check);
      transform: rotate(0deg) scale(1);
    }

    &::after {
      border: #68d391 solid 2px;
      transition-duration: 300ms !important;
      transition-timing-function: ease-in !important;
      transition-property: all !important;
    }
  }
}
</style>
