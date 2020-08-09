import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import ModpackVersion from 'App/Models/ModpackVersion'
import TeamUser from 'App/Models/TeamUser'

export default class ModsController {
  public async getMods ({ request, params, auth, response }: HttpContextContract) {
    // Validate datas
    const data = await request.validate({
      schema: schema.create({
        v: schema.number([
          rules.unsigned(),
          rules.exists({
            column: 'id',
            table: 'modpack_versions',
          }),
        ]),
      }),
    })

    // Get the modpack version
    const version = await ModpackVersion
      .query()
      .where('id', data.v)
      .andWhere('modpack_id', params.id)
      .preload('modpack', (query) => {
        query.preload('team')
      })
      .preload('mods')
      .firstOrFail()

    // Check if the user has the right to get the modpack
    const teamUser = await TeamUser
      .query()
      .preload('teamRole', (query) => {
        query.preload('permission')
      })
      .preload('team', (query) => {
        query.preload('defaultPermission')
      })
      .where('user_id', auth.user!.id)
      .andWhere('team_id', version.modpack.teamId)
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
      mods: version.mods,
      team: teamUser.team.toJSON(),
      userPerms,
    })
  }
}
