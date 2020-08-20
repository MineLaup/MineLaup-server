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
        :disabled="disabled"
        class="block w-6 h-6 mr-2 rounded-full border-2 appearance-none cursor-pointer outline-none text-green-400 transition duration-200 ease-in shadow"
        @input="$emit('input', $event.target.checked)"
      />
      <label
        :for="id"
        class="toggle-label inline rounded-full cursor-pointer ml-8"
      >
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

  @Prop({ type: Boolean })
  disabled!: boolean
}
</script>

<style lang="scss" scoped>
$fa-font-path: '~@fortawesome/fontawesome-free/webfonts' !default;
@import '~@fortawesome/fontawesome-free/scss/fontawesome';
@import '~@fortawesome/fontawesome-free/scss/solid';

input:disabled {
  border-color: rgba(0, 0, 0, 0.4) !important;
  color: rgba(0, 0, 0, 0.4) !important;
}

input[type='checkbox'] {
  @extend %fa-icon;
  @extend .fas;

  position: absolute;
  width: 24px;
  height: 24px;

  transition-duration: 300ms !important;
  transition-timing-function: ease-in !important;
  transition-property: all !important;

  &::before {
    content: '';
    position: absolute;
    display: block;
    top: 4px;
    left: 4px;
    font-size: 12px;
    width: 24px;
    height: 24px;
    transition-duration: 300ms !important;
    transition-timing-function: ease-in !important;
    transition-property: all !important;
    transform: rotate(100deg) scale(0);
  }

  &:checked {
    &::before {
      content: fa-content($fa-var-check);
      transform: rotate(0deg) scale(1);
    }

    @apply border-green-400;
  }
}
</style>
