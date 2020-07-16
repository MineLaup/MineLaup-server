<template>
  <div class="flex flex-row justify-center">
    <div class="flex-1 p-4 max-w-4xl overflow-y-auto">
      <h1 class="text-2xl uppercase text-gray-900 font-bold">
        {{ $t('pages.admin.settings.title') }}
      </h1>

      <form
        ref="settings_form"
        class="p-10 items-center"
        @submit.prevent="updateSettings"
      >
        <t-alert v-if="errorMsg" :message="$t(errorMsg)" />

        <p>{{ $t('pages.admin.settings.nothing') }}</p>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import TButton from '~/components/forms/TButton.vue'
import TTextarea from '~/components/forms/TTextarea.vue'
import TInput from '~/components/forms/TInput.vue'
import TAlert from '~/components/bases/TAlert.vue'
import TCheckbox from '~/components/forms/TCheckbox.vue'

@Component({
  components: {
    TButton,
    TTextarea,
    TInput,
    TAlert,
    TCheckbox,
  },
  middleware: ['admin'],
})
export default class AdminSettings extends Vue {
  errorMsg: string = ''

  errors: Partial<String> = {}

  form = {}

  mounted() {
    // Submit the form when the user press CTRL+ENTER
    document.addEventListener('keypress', (event: KeyboardEvent) => {
      if (event.keyCode !== 10 || !event.ctrlKey) return

      this.updateSettings()
    })
  }

  // The form is always valid since there is no data to validate
  get formValid() {
    return true
  }

  updateSettings() {
    this.errors = {}
    this.errorMsg = ''
  }
}
</script>
