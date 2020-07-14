import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Team from 'App/Models/Team'
import User from 'App/Models/User'
import TeamRole from 'App/Models/TeamRole'
import TeamUser from 'App/Models/TeamUser'
import Permission from 'App/Models/Permission'
import names from '../../../utils/names-repo'

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

    const defaultPermission = await Permission.create({})

    const team = await Team.create({
      name: data.name,
      summary: data.summary,
      ownerId: auth.user!.id,
      permissionId: defaultPermission.id,
    })

    await TeamUser.create({
      userId: auth.user!.id,
      teamId: team.id,
      teamRoleId: null,
    })

    response.send(team)
  }

  public async get ({ response, auth, params, request }: HttpContextContract) {
    const id = params.id

    let query: Team | null

    await TeamUser
      .query()
      .where('user_id', auth.user!.id)
      .andWhere('team_id', id)
      .firstOrFail()

    if (request.input('with_permissions')) {
      query = await Team
        .query()
        .preload('defaultPermission')
        .where('id', id)
        .first()
    } else {
      query = await Team
        .query()
        .preload('roles')
        .where('id', id)
        .first()
    }

    if (!query) {
      return response.status(403)
    }

    response.send(query)
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

  public async getRoles ({ params, response, auth }: HttpContextContract) {
    const id = params.id

    const teamExist = await Team
      .query()
      .where('id', id)
      .andWhere('ownerId', auth.user!.id)
      .orderBy('name', 'asc')
      .firstOrFail()

    if (!teamExist) {
      return response.status(404)
    }

    const roles = await TeamRole
      .query()
      .preload('permission')
      .where('teamId', id)

    response.json(roles)
  }

  public async saveRoles ({ params, request, response, auth }: HttpContextContract) {
    const id = params.id

    const teamExist = await Team
      .query()
      .where('id', id)
      .andWhere('ownerId', auth.user!.id).firstOrFail()

    if (!teamExist) {
      return response.status(404)
    }

    const data = await request.validate({
      schema: schema.create({
        name: schema.string.optional(),
        name_disabled: schema.boolean.optional(),

        id: schema.number.optional([
          rules.unsigned(),
          rules.exists({
            column: 'id',
            table: 'team_roles',
          }),
        ]),

        permission: schema.object().members({
          manage_team: schema.boolean(),
          manage_launchers: schema.boolean(),
          manage_modpacks: schema.boolean(),
          manage_users: schema.boolean(),
        }),

        team_id: schema.number([
          rules.unsigned(),
          rules.exists({
            column: 'id',
            table: 'teams',
          }),
        ]),
      }),
    })

    if (data.id) {
      const role = await TeamRole
        .query()
        .preload('permission')
        .where('teamId', id)
        .andWhere('id', data.id)
        .firstOrFail()
      if (role) {
        if (data.name && data.name !== 'default') {
          role.name = data.name
        }
        role.permission.manage_team = data.permission.manage_team
        role.permission.manage_launchers = data.permission.manage_launchers
        role.permission.manage_modpacks = data.permission.manage_modpacks
        role.permission.manage_users = data.permission.manage_users
        await role.permission.save()

        return response.status(200)
      }

      return response.status(404).send('role not found')
    } else {
      const team = await Team
        .query()
        .preload('defaultPermission')
        .where('id', data.team_id)
        .firstOrFail()

      if (team) {
        team.defaultPermission.manage_team = data.permission.manage_team
        team.defaultPermission.manage_launchers = data.permission.manage_launchers
        team.defaultPermission.manage_modpacks = data.permission.manage_modpacks
        team.defaultPermission.manage_users = data.permission.manage_users

        await team.defaultPermission.save()
        return response.status(200)
      }

      return response.status(404).send('role not found')
    }
  }

  public async addRole ({ params, response, auth }: HttpContextContract) {
    const id = params.id

    const teamExist = await Team
      .query()
      .where('id', id)
      .andWhere('ownerId', auth.user!.id).firstOrFail()

    if (!teamExist) {
      return response.status(404)
    }

    const perm = await Permission.create({})

    await TeamRole.create({
      name: (
        names.first_pos[Math.floor(Math.random() * names.first_pos.length)] +
        '_' +
        names.second_pos[Math.floor(Math.random() * names.second_pos.length)]
      ),
      permissionId: perm.id,
      teamId: id,
    })

    return response.status(200)
  }

  public async deleteRole ({ params, request, response, auth }: HttpContextContract) {
    const id = params.id

    const data = await request.validate({
      schema: schema.create({
        id: schema.number([
          rules.unsigned(),
          rules.exists({
            column: 'id',
            table: 'team_roles',
          }),
        ]),
      }),
    })

    const teamExist = await Team
      .query()
      .where('id', id)
      .andWhere('ownerId', auth.user!.id).firstOrFail()

    if (!teamExist) {
      return response.status(404)
    }

    const role = await TeamRole.find(data.id)

    if (role) {
      await role.delete()

      return response.status(200)
    }

    return response.status(404)
  }
}
