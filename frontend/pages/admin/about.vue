<template>
  <div class="flex flex-col items-center">
    <div class="flex-1 p-4 max-w-4xl text-center">
      <div class="image">
        <img src="~/assets/images/logo-1024.png" alt="Logo" />
      </div>
      <h1 class="text-5xl uppercase text-gray-900 dark:text-white font-bold">
        {{ $t('pages.admin.about.title') }}
      </h1>
      <div class="mt-4 mb-12">
        <table class="table-auto w-full">
          <tbody>
            <tr>
              <td class="border border-gray-600 px-4 py-2 font-bold">
                {{ $t('pages.admin.about.version') }}
              </td>
              <td class="border border-gray-600 px-4 py-2">
                {{ $t('app-name') }}
              </td>
            </tr>
            <tr>
              <td class="border border-gray-600 px-4 py-2 font-bold">
                {{ $t('pages.admin.about.version') }}
              </td>
              <td class="border border-gray-600 px-4 py-2">
                {{ pkg.version }}
              </td>
            </tr>
            <tr>
              <td class="border border-gray-600 px-4 py-2 font-bold">
                {{ $t('pages.admin.about.author') }}
              </td>
              <td class="border border-gray-600 px-4 py-2">
                {{ pkg.author }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="flex flex-col flex-1">
        <h1 class="uppercase font-bold mb-2">
          {{ $t('social.title') }}
        </h1>
        <a
          class="px-4 py-2 border rounded-full focus:outline-none transition ease-out duration-300 text-gray-900 dark:text-white mb-2 bg-discord"
          href="https://discord.gg/dS2Wxyr"
          target="_blank"
        >
          <i class="fab w-5 h-5 text-xl mr-2 fa-discord"></i>
          {{ $t('social.discord') }}
        </a>
        <a
          class="px-4 py-2 border rounded-full focus:outline-none transition ease-out duration-300 border-black text-gray-900 dark:text-white hover:bg-black"
          href="https://github.com/MineLaup"
          target="_blank"
        >
          <i class="fab w-5 h-5 text-xl mr-2 fa-github"></i>
          <span>
            {{ $t('social.github') }}
          </span>
        </a>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import { Context } from '@nuxt/types'
import TButton from '~/components/forms/TButton.vue'

@Component({
  components: {
    TButton,
  },
})
export default class AdminAbout extends Vue {
  async asyncData({ $axios }: Context) {
    const pkg = await $axios.$get('/api/')

    return {
      pkg,
    }
  }
}
</script>

<style lang="scss" scoped>
.image {
  width: 20rem;
  height: 20rem;
}
.bg-discord {
  border-color: #7289da;

  &:hover {
    background-color: #7289da;
  }
}
</style>
