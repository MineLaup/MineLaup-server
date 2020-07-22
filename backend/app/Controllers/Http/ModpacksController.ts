import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Modpack from 'App/Models/Modpack'

export default class ModpacksController {
  /**
   * list modpacks function
   */
  public async getList ({ auth, response }: HttpContextContract) {
    // Get the current user teams
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

  /**
   * Create team function
   */
  public async create ({ request, response }: HttpContextContract) {
    // Validate datas
    const data = await request.validate({
      schema: schema.create({
        // The name has to be an unique string of maximum 50 characters
        name: schema.string({}, [
          rules.unique({
            column: 'name',
            table: 'modpacks',
          }),
          rules.maxLength(45),
        ]),
        summary: schema.string.optional({}, [
          rules.maxLength(2048),
        ]),
        team_id: schema.number([
          rules.exists({
            column: 'id',
            table: 'teams',
          }),
        ]),
      }),
      cacheKey: request.url(),
    })

    // Create a modpack
    const modpack = await Modpack.create({
      name: data.name,
      summary: data.summary,
      teamId: data.team_id,
    })
    // Send back the modpack informations
    return response.send(modpack)
  }
}
