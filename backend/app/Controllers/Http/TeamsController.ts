import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Team from 'App/Models/Team'
import User from 'App/Models/User'
import Permission from 'App/Models/Permission'
import Role from 'App/Models/Role'
import TeamUser from 'App/Models/TeamUser'

export default class TeamsController {
  public async list ({ response, auth }: HttpContextContract) {
    const user = await User
      .query()
      .preload('teams')
      .where('id', auth.user!.id).firstOrFail()

    response.send(user.teams)
  }

  public async create ({ request, auth, response }: HttpContextContract) {
    const teamSchema = schema.create({
      name: schema.string({}, [
        rules.unique({
          column: 'name',
          table: 'teams',
        }),
        rules.maxLength(50),
      ]),
      summary: schema.string({}, [
        rules.maxLength(200),
      ]),
    })

    const data = await request.validate({
      schema: teamSchema,
      cacheKey: request.url(),
    })

    const permission = await Permission.create({
      can_create: true,
      can_read: true,
      can_update: true,
      can_delete: true,
    })

    const role = await Role.create({
      name: 'Owner',
      permissionId: permission.id,
    })

    const team = await Team.create({
      name: data.name,
      summary: data.summary,
      ownerId: auth.user!.id,
    })

    await TeamUser.create({
      teamId: team.id,
      userId: auth.user!.id,
      roleId: role.id,
    })

    response.send(team)
  }

  public async get ({ response, auth, params }: HttpContextContract) {
    const id = params.id

    const query = await TeamUser.query().preload('team').where('user_id', auth.user!.id).andWhere('team_id', id).first()

    if (!query) {
      return response.status(403)
    }

    response.send(query.team)
  }
}
