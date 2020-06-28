import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class Admin {
  public async handle ({ auth, response }: HttpContextContract, next: () => Promise<void>) {
    if (auth.isLoggedIn && auth.user!.role === 3) {
      await next()
    } else {
      response.status(403)
    }
  }
}
