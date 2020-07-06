import { Middleware } from '@nuxt/types'

const admin: Middleware = ({ $auth, redirect }) => {
  if ($auth.user.role < 3) {
    redirect('/')
  }
}

export default admin
