<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import { Context } from '@nuxt/types'

@Component
export default class Redirect extends Vue {
  asyncData({ redirect }: Context) {
    redirect('/')
  }
}
</script>
