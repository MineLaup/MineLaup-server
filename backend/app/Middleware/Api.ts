import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Launcher from 'App/Models/Launcher'

export default class Api {
  public async handle ({ request, response }: HttpContextContract, next: () => Promise<void>) {
    const apiKey =request.headers().authorization

    if (apiKey) {
      const launcher = await Launcher.findBy('api_key', apiKey)

      if (launcher) {
        if (launcher.disabled) {
          return response.forbidden('Launcher disabled')
        }
        request.launcher = launcher

        return await next()
      }
      return await response.status(404)
    }

    return response.unauthorized('')
  }
}
