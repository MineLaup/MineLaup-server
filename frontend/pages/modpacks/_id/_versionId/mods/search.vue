<template>
  <div class="flex flex-row p-4 pl-0">
    <div class="border-r-2 overflow-y-auto w-mods-list">
      <div class="sticky top-0 bg-white dark:bg-gray-700 border-b">
        <nuxt-link
          class="flex flex-row px-4 py-3 hover:text-green-400"
          :to="`/modpacks/${$route.params.id}/${$route.params.versionId}/mods`"
        >
          <span class="w-4 h-4 mr-2">
            <i class="fas fa-arrow-left"></i>
          </span>
          <span class="flex-1">
            {{ $t('pages.modpacks.mods.back') }}
          </span>
        </nuxt-link>
        <t-input
          id="search-mod"
          v-model="searchField"
          class="p-2"
          icon="search"
          :label="$t('pages.modpacks.mods.search')"
          autocomplete="off"
          @input="search"
        />
      </div>

      <div class="pt-2">
        <a
          v-for="mod in modsList"
          :key="mod.id"
          class="flex flex-row items-center"
          href="#"
          :class="{
            'text-white bg-green-400': selected === mod.id,
            'hover:bg-gray-200 dark-hover:bg-gray-600': selected !== mod.id,
          }"
          @click="selectMod(mod)"
        >
          <span class="px-4 py-2">
            <img :src="mod.attachments[0].url" class="h-12 w-12 rounded" />
          </span>
          <span class="text-lg">
            {{ mod.name }}
          </span>
        </a>
      </div>
    </div>
    <div class="flex-1 p-4 overflow-auto max-h-full">
      <h1 class="text-2xl font-semibold pb-1 border-b mb-4">
        <a
          :href="currentView.websiteUrl"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ currentView.name }}
        </a>
      </h1>
      {{ /* eslint-disable-next-line */ }}
      <div v-html="currentView.content" class="mod-content"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import debounce from 'lodash/debounce'
import { Context } from '@nuxt/types'
import TInput from '~/components/forms/TInput.vue'

@Component({
  components: {
    TInput,
  },
})
export default class ModpackViewSearchMods extends Vue {
  searchField: string = ''
  modsList: Array<Partial<any>> = []

  selected: number = 0

  currentView: Partial<any> = {}
  version: Partial<any> = {}

  async asyncData({ $axios, params }: Context) {
    const version = await $axios.$get(`/api/modpack/${params.id}/version`, {
      params: {
        id: params.versionId,
      },
    })

    return { version }
  }

  search = debounce(this.searchMods, 250)

  async searchMods() {
    const mods = await this.$axios.$get(`/curse/addon/search`, {
      params: {
        // game 432: Minecraft
        gameId: 432,
        // game version
        gameVersion: this.version.mc_version,
        index: 0,
        pageSize: 100,
        searchFilter: this.searchField,
        sectionId: 6,
        sort: 0,
      },
    })

    this.modsList = mods

    this.selected = mods[0]?.id

    if (this.modsList && this.selected) {
      this.selectMod(this.modsList[0])
    }
  }

  async selectMod(mod: Partial<any>) {
    this.selected = mod.id
    const description = await this.$axios.$get(
      `/curse/addon/${mod.id}/description`
    )

    this.currentView = {
      name: mod.name,
      content: this.$sanitize(description, {
        allowedTags: [
          'img',
          'h3',
          'h4',
          'h5',
          'h6',
          'blockquote',
          'p',
          'a',
          'ul',
          'ol',
          'nl',
          'li',
          'b',
          'i',
          'strong',
          'em',
          'strike',
          'abbr',
          'code',
          'hr',
          'br',
          'div',
          'table',
          'thead',
          'caption',
          'tbody',
          'tr',
          'th',
          'td',
          'pre',
          'iframe',
          'span',
        ],
        allowedAttributes: {
          '*': ['href', 'align', 'alt', 'center', 'bgcolor', 'style', 'class'],
          img: ['src', 'style', 'class', 'width', 'height'],
          a: ['href', 'name', 'target', 'style', 'class', 'rel'],
          iframe: ['*'],
        },
        transformTags: {
          a(tagName: string, attribs: Partial<any>) {
            if (!attribs.href.startsWith('http')) {
              const link = decodeURIComponent(decodeURI(attribs.href)).replace(
                /(\/linkout\?remoteUrl=)/,
                ''
              )

              return {
                tagName,
                attribs: {
                  href: decodeURI(link),
                  target: '_blank',
                },
              }
            } else {
              return {
                tagName,
                attribs: {
                  href: attribs.href,
                  target: '_blank',
                },
              }
            }
          },
        },
      }),
      websiteUrl: mod.websiteUrl,
    }
  }
}
</script>
