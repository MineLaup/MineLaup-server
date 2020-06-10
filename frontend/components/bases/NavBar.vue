<template>
  <nav
    class="flex items-center justify-between flex-wrap px-4 py-2 bg-gray-800 text-white h-32 md:h-20"
  >
    <div class="flex items-center flex-shrink-0 text-grey-900 mr-6">
      <img
        src="~/assets/images/logo-1024.png"
        alt="App logo"
        class="h-16 w-16 mr-2"
      />
      <nuxt-link class="font-semibold text-xl tracking-thight" to="/">
        {{ $t('app-name') }}
      </nuxt-link>
    </div>
    <div class="flex-end">
      <div class="w-12 text-right">
        <div ref="languageList">
          <a
            class="border-b-2 border-transparent hover:border-white w-10 cursor-pointer py-1 select-none select-input transition ease-out duration-300"
            :class="{ 'border-white': showLanguageList }"
            @click="toggleList"
          >
            <span class="mr-2 uppercase">
              {{ $i18n.locale }}
            </span>
            <i class="fas fa-caret-down"></i>
          </a>

          <ul
            v-if="showLanguageList"
            class="z-10 text-left bg-white dark:bg-gray-700 p-1 rounded-lg w-1/5 right-0 mr-2 mt-4 absolute shadow-lg overflow-x-auto"
          >
            <li
              v-for="locale in locales"
              :key="locale.iso"
              class="text-black dark:text-white border-b last:border-transparent border-gray-400 px-4 py-2 hover:bg-gray-200 dark-hover:bg-gray-600 cursor-pointer"
              :class="{
                'text-green-600 dark:text-green-600':
                  locale.code == $i18n.locale,
              }"
              @click="changeLanguage(locale.code)"
            >
              {{ locale.name }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import sortBy from 'lodash/sortBy'
@Component
export default class NavBar extends Vue {
  showLanguageList: boolean = false
  toggleList() {
    this.showLanguageList = !this.showLanguageList
  }

  changeLanguage(languageCode: string) {
    this.$i18n.setLocale(languageCode)
    this.showLanguageList = false
  }

  mounted() {
    window.addEventListener('click', (event) => {
      event.stopPropagation()
      const el = this.$el.querySelector('.select-input')
      if (el && !el.contains(event.target as Node)) {
        this.showLanguageList = false
      }
    })
  }

  get locales() {
    return sortBy(this.$i18n.locales, ['code'])
  }
}
</script>
