import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Launcher from 'App/Models/Launcher'
import TeamUser from 'App/Models/TeamUser'
import hat from 'hat'

export default class LaunchersController {
  /**
   * List launchers functions
   */
  public async list ({ auth, response }: HttpContextContract) {
    // Get the current user team
    const user = await User
      .query()
      .preload('teams', (query) => {
        query.preload('launchers')
        query.select('id', 'name')
      })
      .where('id', auth.user!.id)
      .firstOrFail()

    return response.json(user.teams)
  }

  /**
   * Create launcher function
   */
  public async create ({ request, response }: HttpContextContract) {
    // Validate datas
    const data = await request.validate({
      schema: schema.create({
        // The name has to be an unique string of maximum 50 characters
        name: schema.string({}, [
          rules.unique({
            column: 'name',
            table: 'launchers',
          }),
          rules.maxLength(45),
        ]),
        summary: schema.string.optional({}, [
          rules.maxLength(2000),
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

    // Create a launcher
    const launcher = await Launcher.create({
      name: data.name,
      summary: data.summary,
      teamId: data.team_id,
      apiKey: hat(),
    })

    return response.send(launcher)
  }

  /**
   * Get launcher function
   */
  public async get ({ auth, response, params }: HttpContextContract) {
    // Get the launcher
    const launcher = await Launcher.findOrFail(params.id)

    // Check if the user has the right to get the launcher
    const teamUser = await TeamUser
      .query()
      .preload('teamRole', (query) => {
        query.preload('permission')
      })
      .preload('team', (query) => {
        query.preload('defaultPermission')
      })
      .where('user_id', auth.user!.id)
      .andWhere('team_id', launcher.teamId)
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
      ...launcher.toJSON(),
      team: teamUser.team.toJSON(),
      userPerms,
    })
  }

  /**
   * Delete launcher function
   */
  public async delete ({ params, auth, response}: HttpContextContract) {
    // Get launcher instance from id
    const launcher = await Launcher
      .query()
      .preload('team', (query) => {
        query.preload('defaultPermission')
      })
      .where('id', params.id)
      .firstOrFail()

    // If the current user is the owner or that the default permission allow to manage launchers
    if (launcher.team.ownerId === auth.user!.id || launcher.team.defaultPermission.manage_launchers) {
      await launcher.delete()

      // Give a feedback
      return response.status(200)
    } else {
      const currentUser = await TeamUser
        .query()
        .preload('teamRole', (query) => {
          query.preload('permission')
        })
        .where('team_id', launcher.teamId)
        .andWhere('user_id', auth.user!.id)
        .firstOrFail()

      if (currentUser.teamRole.permission.manage_launchers) {
        await launcher.delete()

        // Give a feedback
        return response.status(200)
      } else {
        // Return forbidden access
        return response.status(403)
      }
    }
  }

  /**
   * Regenerate API key
   */
  public async regenerate ({ auth, response, params }: HttpContextContract) {
    // Get launcher instance from id
    const launcher = await Launcher
      .query()
      .preload('team', (query) => {
        query.preload('defaultPermission')
      })
      .where('id', params.id)
      .firstOrFail()

    // If the current is the owner or that the default permission allow to manage launchers
    if (launcher.team.ownerId === auth.user!.id || launcher.team.defaultPermission.manage_launchers) {
      launcher.apiKey = hat()
      await launcher.save()

      // Give a feedback
      return response.status(200)
    }
  }
}
