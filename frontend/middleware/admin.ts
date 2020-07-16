import { Middleware } from '@nuxt/types'
import { UserRole } from '~/types/UserRole'

const admin: Middleware = ({ $auth, redirect }) => {
  // Redirect the user when he doesn't have admin permissions
  if ($auth.user.role < UserRole.admin) {
    redirect('/')
  }
}

export default admin
