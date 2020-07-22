import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class ModpacksController {
  public async getList ({ auth, response }: HttpContextContract) {
    // GEt the current user teams
    const user = await User
      .query()
      .preload('teams', (query) => {
        query.preload('modpacks')
        query.select('id', 'name')
      })
      .where('id', auth.user!.id)
      .firstOrFail()

    return response.json(user.teams)
  }
}
