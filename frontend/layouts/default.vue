<template>
  <ColorScheme>
    <div
      class="h-screen flex flex-col"
      :class="{ 'overflow-hidden': menuOpen }"
    >
      <nav-bar></nav-bar>

      <div
        class="flex flex-1 flex-col md:flex-row dark:text-white dark:bg-gray-700"
      >
        <ul
          class="flex flex-row md:flex-col items-center text-center bg-gray-900 text-gray-400 h-10 md:h-full md:w-12 overflow-x-auto md:overflow-visible"
        >
          <t-side-bar-button
            :name="$t('layout.side-bar.teams')"
            icon="users"
            to="/teams"
          />
          <t-side-bar-button
            :name="$t('layout.side-bar.launcher')"
            icon="rocket"
            to="/launchers"
          />
          <t-side-bar-button
            :name="$t('layout.side-bar.modpacks')"
            icon="box-open"
            to="/modpack"
          />
          <t-side-bar-button
            v-if="hasAdminPermission"
            :name="$t('layout.side-bar.administration')"
            icon="user-cog"
            to="/admin"
          />
          <t-side-bar-button
            :name="$t('layout.side-bar.settings')"
            icon="cog"
            to="/settings"
          />
          <t-side-bar-action
            :name="$t('layout.side-bar.logout')"
            icon="sign-out-alt"
            @click="$auth.logout()"
          />
          <t-side-bar-action
            :name="
              isDarkMode
                ? $t('layout.side-bar.dark-mode.disable')
                : $t('layout.side-bar.dark-mode.enable')
            "
            :icon="isDarkMode ? 'moon' : 'sun'"
            @click="toggleColorMode"
          />

          <t-side-bar-action
            :name="$t('layout.side-bar.menu')"
            icon="bars"
            class="ml-auto mr-4 sm:hidden"
            @click="menuOpen = true"
          />
        </ul>

        <div class="flex-1 flex flex-row">
          <div
            class="sm:w-64 bg-gray-900 absolute sm:relative z-50 sm:z-0 w-screen h-screen md:h-auto text-white top-0 sm:block"
            :class="{ hidden: !menuOpen }"
          >
            <span
              class="absolute top-0 right-0 mt-6 mr-6 cursor-pointer sm:hidden"
              @click="menuOpen = false"
            >
              <i class="fas fa-times fa-lg"></i>
            </span>
            <h1
              class="text-2xl uppercase font-bold mt-4 ml-10 sm:text-xl sm:ml-4"
            >
              {{ $t($store.getters['menu/getTitle']) }}
            </h1>
            <ul class="mt-8 sm:mt-4">
              <t-side-bar-item
                v-if="$store.getters['menu/hasAdditional']"
                :to="$store.getters['menu/getAdditional'].path"
                exact
              >
                <span class="w-14 h-14">
                  <i
                    class="fas"
                    :class="'fa-' + $store.getters['menu/getAdditional'].icon"
                  />
                </span>
                <span>
                  {{ $t($store.getters['menu/getAdditional'].name) }}
                </span>
              </t-side-bar-item>
              <t-side-bar-item
                v-for="(item, index) in $store.getters['menu/getList']"
                :key="index"
                :to="item.path"
              >
                {{ !item.nameI18n ? item.name : $t(item.nameI18n) }}
              </t-side-bar-item>
            </ul>
          </div>

          <nuxt class="flex-1 overflow-auto full-height" />
        </div>
      </div>
    </div>
  </ColorScheme>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'nuxt-property-decorator'
import debounce from 'lodash/debounce'
import NavBar from '~/components/bases/NavBar.vue'
import TSideBarButton from '~/components/sidebar/TSideBarButton.vue'
import TSideBarAction from '~/components/sidebar/TSideBarAction.vue'
import TSideBarItem from '~/components/sidebar/TSideBarItem.vue'
import { UserRole } from '~/types/UserRole'

@Component({
  components: {
    NavBar,
    TSideBarButton,
    TSideBarAction,
    TSideBarItem,
  },
})
export default class Default extends Vue {
  menuOpen: boolean = false

  // Getter used to know if the user have permissions
  get hasAdminPermission() {
    return this.$auth.user?.role >= UserRole.admin
  }

  mounted() {
    // When the component is mounted, the color theme is set to the user preference
    this.$colorMode.preference = this.$auth.user.color_mode.toLowerCase()
  }

  // When the route change the navigation menu is closed
  @Watch('$route')
  onRouteChange() {
    this.menuOpen = false
  }

  // Check if the color theme is dark mode
  get isDarkMode() {
    return this.$colorMode.preference === 'dark'
  }

  // Debounced function to change the color mode
  toggleColorMode = debounce(() => {
    // Get the new color state from the current
    const newColor = this.$colorMode.preference === 'light' ? 'dark' : 'light'
    // Send a request to the server to update the user preference
    this.$axios
      .post('/api/user/color-mode', {
        color: newColor,
      })
      .then(() => {
        // If the requst is fine then change the color mode
        this.$colorMode.preference = newColor
      })
  }, 500)
}
</script>

<style lang="scss">
.full-height {
  height: calc(100vh - 5rem);
}
</style>
