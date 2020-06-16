import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Permission from 'App/Models/Permission'
import Role from 'App/Models/Role'
import TeamUser from 'App/Models/TeamUser'
import Team from 'App/Models/Team'

export default class TeamsController {
  public async list ({ auth, response }: HttpContextContract) {
    const user_teams = await (await TeamUser.query().select('id').where('user_id', auth.user!.id)).map(team => {
      return team.id
    })

    const teams = await Team.query().whereIn('id', user_teams)

    response.send(teams)
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
      userId: auth.user!.id,
      teamId: team.id,
      roleId: role.id,
    })

    response.send(team)
  }
}
