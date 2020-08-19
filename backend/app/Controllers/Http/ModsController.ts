import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Mod from 'App/Models/Mod'
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

  /**
   * Add mod to modpack function
   */
  public async addMod ({ params, request, response, auth }: HttpContextContract) {
    // Validate datas
    const data = await request.validate({
      schema: schema.create({
        v: schema.number([
          rules.exists({
            column: 'id',
            table: 'modpack_versions',
          }),
        ]),
        modId: schema.number([
          rules.unique({
            column: 'mod_id',
            table: 'mods',
            where: {
              modpack_version_id: request.input('v'),
            },
          }),
        ]),
        fileId: schema.number(),
      }),
    })

    // Get modpack instance from id
    const modpackVersion = await ModpackVersion
      .query()
      .preload('modpack', (query) => {
        query.preload('team', (query) => {
          query.preload('defaultPermission')
        })
      })
      .where('publised', false)
      .where('modpackId', params.id)
      .where('id', data.v)
      .firstOrFail()

    if (!modpackVersion) {
      return response.status(403)
    }

    // If the current user is the team owner
    if (modpackVersion.modpack.team.ownerId === auth.user!.id) {
      await Mod.create({
        modId: data.modId,
        fileId: data.fileId,
        modpackVersionId: modpackVersion.id,
      })

      return response.status(200)
    } else {
      // Get the current user permissions
      const currentUser = await TeamUser
        .query()
        .preload('teamRole', (query) => {
          query.preload('permission')
        })
        .where('teamId', modpackVersion.modpack.teamId)
        .where('userId', auth.user!.id)
        .firstOrFail()

      // Check permissions
      if (currentUser.teamRole.permission.manage_modpacks ||
        modpackVersion.modpack.team.defaultPermission.manage_modpacks) {
        await Mod.create({
          modId: data.modId,
          fileId: data.fileId,
          modpackVersionId: modpackVersion.id,
        })

        return response.status(200)
      } else {
        // Send access forbidden
        return response.status(403)
      }
    }
  }

  /**
   * Remove mod from modpack version function
   */
  public async removeMod ({ params, request, response, auth }: HttpContextContract) {
    // Validate datas
    const data = await request.validate({
      schema: schema.create({
        v: schema.number([
          rules.exists({
            column: 'id',
            table: 'modpack_versions',
          }),
        ]),
        id: schema.number([
          rules.exists({
            column: 'mod_id',
            table: 'mods',
            where: {
              modpack_version_id: request.input('v'),
            },
          }),
        ]),
      }),
    })

    // Get modpack instance from id
    const modpackVersion = await ModpackVersion
      .query()
      .preload('modpack', (query) => {
        query.preload('team', (query) => {
          query.preload('defaultPermission')
        })
      })
      .where('published', false)
      .where('modpackId', params.id)
      .where('id', data.v)
      .firstOrFail()

    if (!modpackVersion) {
      return response.status(403)
    }

    // If the current user is the team owner
    if (modpackVersion.modpack.team.ownerId === auth.user!.id) {
      const mod = await Mod
        .query()
        .where('mod_id', data.id)
        .where('modpack_version_id', data.v)
        .first()

      if (!mod) {
        return response.status(404)
      }

      await mod.delete()

      return response.status(200)
    } else {
      // Get the current user permissions
      const currentUser = await TeamUser
        .query()
        .preload('teamRole', (query) => {
          query.preload('permission')
        })
        .where('teamId', modpackVersion.modpack.teamId)
        .where('userId', auth.user!.id)
        .firstOrFail()

      // Check permissions
      if (currentUser.teamRole.permission.manage_modpacks ||
        modpackVersion.modpack.team.defaultPermission.manage_modpacks) {
        const mod = await Mod
          .query()
          .where('mod_id', data.id)
          .where('modpack_version_id', data.v)
          .first()

        if (!mod) {
          return response.status(404)
        }

        await mod.delete()

        return response.status(200)
      } else {
        // Send access forbidden
        return response.status(403)
      }
    }
  }
}
