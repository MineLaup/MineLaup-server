<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import { Context } from '@nuxt/types'

@Component
export default class Redirect extends Vue {
  // Redirect the user to the main route for every unknow routes
  asyncData({ redirect }: Context) {
    redirect('/')
  }
}
</script>
