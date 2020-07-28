<template>
  <div class="flex flex-row justify-center full-height">
    <div class="flex flex-col flex-1 p-4 overflow-y-auto">
      <span class="text-2xl text-gray-900 dark:text-white">
        <nuxt-link
          :to="'/modpacks/' + $route.params.id"
          class="mr-2 hover:text-green-400"
        >
          <i class="fas fa-arrow-left"></i>
        </nuxt-link>
        <h1 class="uppercase font-bold inline">
          {{ $t('pages.modpacks.permissions.title') }}
        </h1>
      </span>

      <div class="flex flex-row mt-16 flex-1">
        <div class="md:border-r md:w-64 h-full">
          <div class="flex flex-col">
            <div class="flex flex-1 justify-between mb-4 px-2">
              <span class="font-sans uppercase font-bold">
                {{ $t('pages.modpacks.permissions.roles') }}
              </span>
              <span
                class="cursor-pointer hover:text-gray-700 dark-hover:text-gray-200"
                @click="addRole"
              >
                <i class="fas fa-plus-circle"></i>
              </span>
            </div>
            <div
              v-for="(role, index) in roles"
              :key="index"
              class="flex-1 py-2 px-4 select-none cursor-pointer"
              :class="{ 'bg-green-400 text-white': selected == index }"
              @click="setRole(index)"
            >
              {{ role.name || 'default' }}
            </div>
          </div>
        </div>
        <div class="flex-1 p-10">
          <h2>{{ form.name }}</h2>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import { Context } from '@nuxt/types'
import TCheckbox from '~/components/forms/TCheckbox.vue'
import TButton from '~/components/forms/TButton.vue'

@Component({
  components: {
    TCheckbox,
    TButton,
  },
})
export default class ModpackPermissions extends Vue {
  name = ''

  selected: number = 0

  roles: Array<Partial<any>> = []

  form: Partial<any> = {
    id: 0,
    team_id: 0,
    permission: {
      manage_modpacks: false,
    },
  }

  errors: Partial<any> = {}
  errorMsg: string = ''

  async asyncData({ redirect, $axios, params }: Context) {
    // Fetch modpack informations
    const modpack = await $axios.$get(`/api/modpack/${params.id}`).catch(() => {
      // If failed, redirect the user
      return redirect(`/modpacks/${params.id}`)
    })

    // Fetch the modpacks roles
    const roles = await $axios
      .$get(`/api/modpack/${params.id}/roles`)
      .catch(() => {
        // If failed, redirect the user
        return redirect(`/modpacks/${params.id}`)
      })

    return {
      modpack,
      roles,
    }
  }

  async addRole() {}
}
</script>
