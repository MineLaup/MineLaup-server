import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Team from 'App/Models/Team'
import User from 'App/Models/User'
import TeamRole from 'App/Models/TeamRole'
import TeamUser from 'App/Models/TeamUser'
import Permission from 'App/Models/Permission'
import names from '../../../utils/names-repo'

export default class TeamsController {
  /**
   * List team function
   */
  public async list ({ response, auth }: HttpContextContract) {
    // Get the current user teams
    const user = await User
      .query()
      .preload('teams', (query) => {
        query.orderBy('name', 'asc')
      })
      .where('id', auth.user!.id)
      .firstOrFail()

    return response.json(user.teams)
  }

  /**
   * Create team function
   */
  public async create ({ request, auth, response }: HttpContextContract) {
    // Validate datas
    const data = await request.validate({
      schema: schema.create({
        // The name has to be an unique string of maximum 50 characters
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
      }),
      cacheKey: request.url(),
    })

    // Create a permission for the team
    const defaultPermission = await Permission.create({})

    // Create a team
    const team = await Team.create({
      name: data.name,
      summary: data.summary,
      ownerId: auth.user!.id,
      permissionId: defaultPermission.id,
    })

    // Added the user to the team
    await TeamUser.create({
      userId: auth.user!.id,
      teamId: team.id,
      teamRoleId: null,
    })

    // Send back the team informations
    return response.send(team)
  }

  /**
   * Get team function
   */
  public async get ({ response, auth, params }: HttpContextContract) {
    // Check if the current user is in the team
    const teamUser = await TeamUser
      .query()
      .preload('teamRole', (query: TeamRole) => {
        query.preload('permission')
      })
      .preload('team', (query: Team) => {
        query.preload('defaultPermission')
      })
      .where('user_id', auth.user!.id)
      .andWhere('team_id', params.id)
      .firstOrFail()

    let userPerms: any = null

    // Is the user is the owner
    if (teamUser.team.ownerId === auth.user!.id) {
      // Set the permissions
      userPerms = {
        owner: true,
      }
    // Is the user have a role
    } else if (teamUser.teamRoleId) {
      // Set the permissions
      userPerms = teamUser.teamRole.permission
    } else {
      userPerms = teamUser.team.defaultPermission
    }

    // Send the team information and permissions
    response.send({
      ...teamUser.team.toJSON(),
      userPerms,
    })
  }

  /**
   * Get team users list
   */
  public async fetchUsers ({ request, params, response, auth }: HttpContextContract) {
    const id = params.id
    const page = request.input('page') || 1
    const limit = request.input('limit') || 10

    // Check if the user is in the team with this query
    await TeamUser
      .query()
      .where('team_id', id)
      .andWhere('user_id', auth.user!.id)
      .firstOrFail()

    // Get team's users list
    const query = await TeamUser
      .query()
      .where('team_id', id)
      .preload('user')
      .preload('teamRole')
      .paginate(page, limit)

    // Get team's roles list
    const roleQuery = await TeamRole
      .query()
      .where('teamId', id)

    // Send informations
    response.send({
      users: query.toJSON(),
      roles: roleQuery,
    })
  }

  /**
   * Delete team function
   */
  public async deleteTeam ({ params, auth, response }: HttpContextContract) {
    // Get team instance from id
    const query = await Team.findOrFail(params.id)

    // If the current user is not the owner, cancel the process
    if (query.ownerId !== auth.user!.id) {
      return response.status(403)
    }

    // Delete the team
    await query.delete()

    // Give a feedback
    return response.status(200)
  }

  /**
   * Get team's roles list
   */
  public async getRoles ({ params, response, auth }: HttpContextContract) {
    /**
     * Get the current user team
     */
    const team = await Team
      .query()
      .preload('roles', (query: TeamRole) => {
        query.preload('permission')
      })
      .where('id', params.id)
      .andWhere('ownerId', auth.user!.id)
      .orderBy('name', 'asc')
      .firstOrFail()

    // Send back informations
    response.json(team.roles)
  }

  /**
   * Save role function
   */
  public async saveRoles ({ params, request, response, auth }: HttpContextContract) {
    // Check information, permit to check if the user is the owner
    const team = await Team
      .query()
      .preload('defaultPermission')
      .where('id', params.id)
      .andWhere('ownerId', auth.user!.id)
      .firstOrFail()

    // Validate datas
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

    // If an id is provide, then edit a team role
    if (data.id) {
      const role = await TeamRole
        .query()
        .preload('permission')
        .where('teamId', params.id)
        .andWhere('id', data.id)
        .firstOrFail()

      if (data.name && data.name !== 'default') {
        role.name = data.name
        await role.save()
      }
      // Set new values
      role.permission.manage_team = data.permission.manage_team
      role.permission.manage_launchers = data.permission.manage_launchers
      role.permission.manage_modpacks = data.permission.manage_modpacks
      role.permission.manage_users = data.permission.manage_users
      await role.permission.save()

      // Give feedback
      return response.status(200)
    // Else, edit the default permission
    } else {
      // Set new values
      team.defaultPermission.manage_team = data.permission.manage_team
      team.defaultPermission.manage_launchers = data.permission.manage_launchers
      team.defaultPermission.manage_modpacks = data.permission.manage_modpacks
      team.defaultPermission.manage_users = data.permission.manage_users
      await team.defaultPermission.save()

      // Give feedback
      return response.status(200)
    }
  }

  /**
   * Add role to team function
   */
  public async addRole ({ params, response, auth }: HttpContextContract) {
    // Check information, permit to check if the user is the owner
    await Team
      .query()
      .preload('roles')
      .where('id', params.id)
      .andWhere('ownerId', auth.user!.id).firstOrFail()

    // Create role permission
    const perm = await Permission.create({})

    // Create role with a random name by default using integrated dictionary
    await TeamRole.create({
      name: (
        names.first_pos[Math.floor(Math.random() * names.first_pos.length)] +
        '_' +
        names.second_pos[Math.floor(Math.random() * names.second_pos.length)]
      ),
      permissionId: perm.id,
      teamId: params.id,
    })

    // Give feedback
    return response.status(200)
  }

  /**
   * Delete team role
   */
  public async deleteRole ({ params, request, response, auth }: HttpContextContract) {
    // Validate datas
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

    // Check if user is the owner of the team
    await Team
      .query()
      .where('id', params.id)
      .andWhere('ownerId', auth.user!.id)
      .firstOrFail()

    // Get role instance
    const role = await TeamRole.findOrFail(data.id)

    // Delete role
    await role.delete()

    // Give feedback
    return response.status(200)
  }

  /**
   * Delete user from team function
   */
  public async deleteUser ({ params, request, response, auth}: HttpContextContract) {
    // Validate datas
    const data = await request.validate({
      schema: schema.create({
        // The ID has to be an unsigned number which exist in user table
        id: schema.number([
          rules.unsigned(),
          rules.exists({
            column: 'id',
            table: 'users',
          }),
        ]),
      }),
    })

    // Get team instance
    const team = await Team
      .query()
      .preload('defaultPermission')
      .where('id', params.id)
      .firstOrFail()

    // If the current user is the owner of the team
    if(team.ownerId === auth.user!.id) {
      // Delete the user
      await TeamUser
        .query()
        .preload('teamRole')
        .where('teamId', params.id)
        .andWhere('userId', data.id)
        .delete()

      // Give feedback
      return response.status(200)
    // If the current user is not the owner
    } else {
      // Get the current user permissions
      const currentUser = await TeamUser
        .query()
        .preload('teamRole', (query: TeamRole) => {
          query.preload('permission')
        })
        .where('teamId', params.id)
        .andWhere('userId', auth.user!.id)
        .firstOrFail()

      // Check permissions
      if (currentUser.teamRole.permission.manage_users || team.defaultPermission.manage_users) {
        // Delete the user if permissions are ok
        await TeamUser
          .query()
          .preload('teamRole')
          .where('teamId', params.id)
          .andWhere('userId', auth.user!.id)
          .delete()

        // Give feedback
        return response.status(200)
      } else {
        // Send access forbidden
        return response.status(403)
      }
    }
  }

  /**
   * Invite user to team function
   */
  public async inviteUser ({ params, request, response, auth }: HttpContextContract) {
    // Validate datas
    const data = await request.validate({
      schema: schema.create({
        // The name has to be alpha-numeric and exist in the user table
        name: schema.string({
          escape: true,
          trim: true,
        },
        [
          rules.regex(/^[a-z0-9]+$/),
          rules.exists({
            column: 'username',
            table: 'users',
          }),
        ]),
      }),
    })

    // Get the team instance
    const team = await Team
      .query()
      .preload('defaultPermission')
      .where('id', params.id)
      .firstOrFail()

    // Get the user id
    const userId = (await User.findByOrFail('username', data.name)).id

    // Is the current user is the owner
    if(team.ownerId === auth.user!.id || team.defaultPermission.manage_users) {
      // Is the user is already in the team
      const alreadyExist = await TeamUser
        .query()
        .where('teamId', params.id)
        .where('userId', userId)
        .first()

      if (alreadyExist) {
        // If exist send back an error
        return response.status(409).send('user already in the team')
      }

      // Added the user to the team
      await TeamUser.create({
        teamId: params.id,
        userId,
      })

      // Give feedback
      return response.status(200)
    // The current user is not the owner
    } else {
      // Get the current user permissions
      const currentUser = await TeamUser
        .query()
        .preload('teamRole', (query: TeamRole) => {
          query.preload('permission')
        })
        .where('teamId', params.id)
        .andWhere('userId', auth.user!.id)
        .firstOrFail()

      // Check permissions
      if (currentUser.teamRole.permission.manage_users) {
        // Is the user is already in the team
        const alreadyExist = await TeamUser
          .query()
          .where('teamId', params.id)
          .where('userId', userId)
          .first()

        if (alreadyExist) {
        // If exist send back an error
          return response.status(409).send('user already in the team')
        }

        // Add the user to the team
        await TeamUser.create({
          teamId: params.id,
          userId,
        })

        // Give feedback
        return response.status(200)
      } else {
        // Send an error for forbidden access
        return response.status(403)
      }
    }
  }
}
