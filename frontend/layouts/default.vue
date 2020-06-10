<template>
  <ColorScheme>
    <div class="h-screen flex flex-col">
      <nav-bar></nav-bar>

      <div class="flex flex-1 flex-row dark:text-white">
        <div
          class="flex-none flex flex-col items-center text-center bg-gray-900 text-gray-400 w-12"
        >
          <ul class="mt-2 flex-1">
            <t-side-bar-button
              :name="$t('layout.side-bar.launcher')"
              icon="rocket"
              to="/launcher"
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
          </ul>
          <ul class="mb-2">
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
          </ul>
        </div>

        <nuxt class="flex-1" />
      </div>
    </div>
  </ColorScheme>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import NavBar from '~/components/bases/NavBar.vue'
import TSideBarButton from '~/components/sidebar/TSideBarButton.vue'
import TSideBarAction from '~/components/sidebar/TSideBarAction.vue'
import { UserRole } from '~/types/UserRole'

@Component({
  components: {
    NavBar,
    TSideBarButton,
    TSideBarAction,
  },
})
export default class Default extends Vue {
  get hasAdminPermission() {
    return this.$auth.user.role >= UserRole.admin
  }

  mounted() {
    this.$colorMode.preference = this.$auth.user.color_mode.toLowerCase()
  }
}
</script>
