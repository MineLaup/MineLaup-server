<template>
  <div class="flex flex-row p-4 pl-0">
    <div class="border-r-2 overflow-y-auto w-mods-list">
      <t-input
        id="search-mod"
        v-model="searchField"
        class="p-2"
        icon="search"
        :label="$t('pages.modpacks.mods.search')"
        autocomplete="off"
      />

      <div class="pt-2">
        <nuxt-link
          v-if="!version.published"
          :to="`/modpacks/${$route.params.id}/${$route.params.versionId}/mods/search`"
          class="hover:text-green-400 flex flex-row px-4 py-3"
        >
          <span class="mr-2">
            <i class="fas fa-plus"></i>
          </span>
          {{ $t('pages.modpacks.mods.add-mods') }}
        </nuxt-link>
        <a
          v-for="mod in list"
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
    <div class="flex-1 p-4 overflow-auto max-h-full flex flex-col">
      <div class="pb-1 border-b mb-4 flex flex-row justify-between">
        <h1 class="text-2xl font-semibold">
          <a
            :href="currentView.websiteUrl"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ currentView.name }}
          </a>
        </h1>
        <a
          v-if="currentView.name"
          href="#"
          class="hover:text-red-500 mr-4 text-lg"
          @click="deleteMod"
        >
          <i class="fas fa-trash"></i>
        </a>
      </div>
      <div v-if="Object.keys(currentView).length" class="flex flex-col flex-1">
        <t-checkbox
          id="required"
          class="p-4"
          :value="currentView.optional"
          :label="$t('pages.modpacks.mods.state')"
          :on-text="$t('pages.modpacks.mods.required')"
          :off-text="$t('pages.modpacks.mods.optionnal')"
          :disabled="!!version.published"
          @input="changeModState"
        />
        {{ /* eslint-disable-next-line */ }}
        <div v-html="currentView.content" class="mod-content flex-1"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import { Context } from '@nuxt/types'
import TInput from '~/components/forms/TInput.vue'
import TCheckbox from '~/components/forms/TCheckbox.vue'

@Component({
  components: {
    TInput,
    TCheckbox,
  },
})
export default class ModpackViewInstalledMods extends Vue {
  searchField: string = ''
  modsList: Array<Partial<any>> = []

  selected: number = 0

  currentView: Partial<any> = {}

  async asyncData({ $axios, params }: Context) {
    const version = await $axios.$get(`/api/modpack/${params.id}/version`, {
      params: {
        id: params.versionId,
      },
    })

    return {
      version,
    }
  }

  async fetch() {
    let mods = await this.$axios.$get(
      `/api/modpack/${this.$route.params.id}/mods`,
      {
        params: {
          v: this.$route.params.versionId,
          search: this.searchField || undefined,
        },
      }
    )

    mods = mods.mods.map((mod: Partial<any>) => {
      return mod.mod_id
    })

    if (mods.length) {
      mods = await this.$axios.$post('/curse/addon', mods)

      this.modsList = mods
      this.selected = mods[0]?.id

      this.selectMod(this.modsList[0])
    }
  }

  get list() {
    const l = this.modsList.filter((mod: Partial<any>) => {
      return mod.name.includes(this.searchField)
    })

    return l
  }

  async selectMod(mod: Partial<any>) {
    this.selected = mod.id

    const { mod: modInfo } = await this.$axios.$get(
      `/api/modpack/${this.$route.params.id}/mod/${mod.id}`,
      {
        params: {
          v: this.$route.params.versionId,
        },
      }
    )

    const description = await this.$axios.$get(
      `/curse/addon/${mod.id}/description`
    )

    this.currentView = {
      name: mod.name,
      id: mod.id,
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
      optional: modInfo.optional,
      websiteUrl: mod.websiteUrl,
    }
  }

  async deleteMod() {
    await this.$axios
      .$delete(`/api/modpack/${this.$route.params.id}/mods`, {
        params: {
          id: this.selected,
          v: this.$route.params.versionId,
        },
      })
      .then(() => {
        this.$fetch()
      })
      .catch((error) => {
        // eslint-disable-next-line
        console.error(error)
      })
  }

  async changeModState() {
    await this.$axios
      .$post(
        `/api/modpack/${this.$route.params.id}/mods/state`,
        {
          state: this.currentView.optional,
        },
        {
          params: {
            id: this.selected,
            v: this.$route.params.versionId,
          },
        }
      )
      .then(() => {
        this.selectMod(this.currentView)
      })
  }
}
</script>

<style lang="scss">
.w-mods-list {
  width: 20rem !important;
}

.mod-content {
  a {
    @apply text-green-500;

    &:hover {
      @apply text-green-400;
    }
  }

  h4 {
    @apply text-3xl;
  }

  img {
    @apply inline;
  }

  p {
    @apply mb-3;
  }
}
.dark-mode {
  .mod-content {
    a {
      @apply text-green-400;

      &:hover {
        @apply text-green-300;
      }
    }
  }
}
</style>
