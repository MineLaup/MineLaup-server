import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Team from 'App/Models/Team'
import User from 'App/Models/User'
import Permission from 'App/Models/Permission'
import TeamRole from 'App/Models/TeamRole'
import TeamUser from 'App/Models/TeamUser'

export default class TeamsController {
  public async list ({ response, auth }: HttpContextContract) {
    const user = await User
      .query()
      .preload('teams')
      .where('id', auth.user!.id)
      .firstOrFail()

    response.json(user.teams)
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

    const team = await Team.create({
      name: data.name,
      summary: data.summary,
      ownerId: auth.user!.id,
    })

    const role = await TeamRole.create({
      name: 'Owner',
      permissionId: permission.id,
      teamId: team.id,
    })

    await TeamUser.create({
      userId: auth.user!.id,
      teamId: team.id,
      teamRoleId: role.id,
    })

    response.send(team)
  }

  public async get ({ response, auth, params }: HttpContextContract) {
    const id = params.id

    const query = await TeamUser
      .query()
      .preload('team')
      .preload('teamRole')
      .where('user_id', auth.user!.id)
      .andWhere('team_id', id)
      .first()

    if (!query) {
      return response.status(403)
    }

    response.send(query.team)
  }

  public async fetchUsers ({ request, params, response, auth }: HttpContextContract) {
    const id = params.id
    const page = request.input('page') || 1
    const limit = request.input('limit') || 10

    const query = await TeamUser
      .query()
      .where('team_id', id)
      .andWhere('userId', auth.user!.id)
      .preload('user')
      .preload('teamRole')
      .paginate(page, limit)

    const roleQuery = await TeamRole
      .query()
      .where('teamId', id)

    response.send({
      users: query.toJSON(),
      roles: roleQuery,
    })
  }

  public async deleteTeam ({ params, auth, response }: HttpContextContract) {
    const id = params.id

    const query = await Team.find(id)

    if (!query) {
      return response.status(404)
    }

    if (query.ownerId !== auth.user!.id) {
      return response.status(403)
    }

    await query.delete()

    return response.status(200)
  }
}
