import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { UserRole } from '../../contracts/UserRole'

export default class Admin {
  public async handle ({ auth, response }: HttpContextContract, next: () => Promise<void>) {
    // Is the user is admin
    if (auth.isLoggedIn && auth.user!.role >= UserRole.admin) {
      // Continue
      await next()
    } else {
      // Send forbidden access
      response.status(403)
    }
  }
}
