import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Modpack from 'App/Models/Modpack'
import Team from 'App/Models/Team'
import TeamUser from 'App/Models/TeamUser'
import TeamRole from 'App/Models/TeamRole'
import ModpackVersion from 'App/Models/ModpackVersion'

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
   * Get a modpack
   */
  public async get ({ auth, response, params }: HttpContextContract) {
    // Get the modpack
    const modpack = await Modpack.findOrFail(params.id)

    // Check if the user has the right to get the modpack
    const teamUser = await TeamUser
      .query()
      .preload('teamRole', (query: TeamRole) => {
        query.preload('permission')
      })
      .preload('team', (query: Team) => {
        query.preload('defaultPermission')
      })
      .where('user_id', auth.user!.id)
      .andWhere('team_id', modpack.teamId)
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
      ...modpack.toJSON(),
      team: teamUser.team.toJSON(),
      userPerms,
    })
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

  /**
   * Delete modpack function
   */
  public async delete ({ params, auth, response }: HttpContextContract) {
    // Get modpack instance from id
    const modpack = await Modpack
      .query()
      .preload('team', (query) => {
        query.preload('defaultPermission')
      })
      .where('id', params.id)
      .firstOrFail()

    // If the current user is the team owner
    if (modpack.team.ownerId === auth.user!.id) {
      await modpack.delete()

      // Give feedback
      return response.status(200)
    } else {
      // Get the current user permissions
      const currentUser = await TeamUser
        .query()
        .preload('teamRole', (query) => {
          query.preload('permission')
        })
        .where('teamId', modpack.teamId)
        .andWhere('userId', auth.user!.id)
        .firstOrFail()

      // Check permissions
      if (currentUser.teamRole.permission.manage_modpacks || modpack.team.defaultPermission.manage_modpacks) {
        await modpack.delete()

        // Give feedback
        return response.status(200)
      } else {
        // Send access forbidden
        return response.status(403)
      }
    }
  }

  /**
   * Add version to modpack function
   */
  public async addVersion ({ request, auth, response, params }: HttpContextContract) {
    // Validate datas
    const data = await request.validate({
      schema: schema.create({
        version: schema.string({
          trim: true,
          escape: true,
        }, [
          rules.maxLength(20),
          rules.unique({
            column: 'version',
            table: 'modpack_versions',
            where: {
              modpack_id: params.id,
            },
          }),
          rules.regex(/^\d\.\d\.\d(-[a-z]+)?$/),
        ]),
        summary: schema.string.optional({
          trim: true,
          escape: true,
        }, [
          rules.maxLength(200),
        ]),
      }),
    })

    // Get modpack instance from id
    const modpack = await Modpack
      .query()
      .preload('team', (query) => {
        query.preload('defaultPermission')
      })
      .where('id', params.id)
      .firstOrFail()

    // If the current user is the team owner
    if (modpack.team.ownerId === auth.user!.id) {
      const version = await ModpackVersion.create({
        version: data.version,
        summary: data.summary,
        modpackId: modpack.id,
      })
      // Give feedback
      return response.json(version)
    } else {
      // Get the current user permissions
      const currentUser = await TeamUser
        .query()
        .preload('teamRole', (query) => {
          query.preload('permission')
        })
        .where('teamId', modpack.teamId)
        .where('userId', auth.user!.id)
        .firstOrFail()

      // Check permissions
      if (currentUser.teamRole.permission.manage_modpacks || modpack.team.defaultPermission.manage_modpacks) {
        const version = await ModpackVersion.create({
          version: data.version,
          summary: data.summary,
          modpackId: modpack.id,
        })
        // Give feedback
        return response.json(version)
      } else {
        // Send access forbidden
        return response.status(403)
      }
    }
  }

  /**
   * List modpack version function
   */
  public async listVersions ({ auth, response, params }: HttpContextContract) {
    // Get modpack instance from id
    const modpack = await Modpack
      .query()
      .preload('team', (query) => {
        query.preload('defaultPermission')
      })
      .where('id', params.id)
      .firstOrFail()

    const versions = await ModpackVersion
      .query()
      .where('modpackId', modpack.id)
      .orderBy('createdAt', 'desc')

    // If the current user is the team owner
    if (modpack.team.ownerId === auth.user!.id) {
      return response.json(versions)
    } else {
      // Get the current user permissions
      const currentUser = await TeamUser
        .query()
        .preload('teamRole', (query) => {
          query.preload('permission')
        })
        .where('teamId', modpack.teamId)
        .where('userId', auth.user!.id)
        .firstOrFail()

      // Check permissions
      if (currentUser) {
        return response.json(versions)
      } else {
        // Send access forbidden
        return response.status(403)
      }
    }
  }

  public async deleteVersion ({ auth, params, request, response }: HttpContextContract) {
    // Validate datas
    const data = await request.validate({
      schema: schema.create({
        id: schema.number([
          rules.exists({
            column: 'id',
            table: 'modpack_versions',
          }),
        ]),
      }),
    })

    // Get modpack instance from id
    const modpack = await Modpack
      .query()
      .preload('team', (query) => {
        query.preload('defaultPermission')
      })
      .where('id', params.id)
      .firstOrFail()

    // If the current user is the team owner
    if (modpack.team.ownerId === auth.user!.id) {
      const version = await ModpackVersion
        .query()
        .where('modpackId', modpack.id)
        .orderBy('createdAt', 'desc')
        .firstOrFail()

      // If the latest version ID is the same than the given ID
      if (version.id === data.id) {
        // Delete the version
        await version.delete()

        // Give feedback
        return response.status(200)
      }

      return response.status(403)
    } else {
      // Get the current user permissions
      const currentUser = await TeamUser
        .query()
        .preload('teamRole', (query) => {
          query.preload('permission')
        })
        .where('teamId', modpack.teamId)
        .where('userId', auth.user!.id)
        .firstOrFail()

      // Check permissions
      if (currentUser.teamRole.permission.manage_modpacks || modpack.team.defaultPermission.manage_modpacks) {
        const version = await ModpackVersion
          .query()
          .where('modpackId', modpack.id)
          .orderBy('createdAt', 'desc')
          .firstOrFail()

        // If the latest version ID is the same than the given ID
        if (version.id === data.id) {
          // Delete the version
          await version.delete()

          // Give feedback
          return response.status(200)
        }

        return response.status(403)
      } else {
        // Send access forbidden
        return response.status(403)
      }
    }
  }

  /**
   * Get modpack version
   */
  public async getVersion ({ request, params, auth, response }: HttpContextContract) {
    // Validate datas
    const data = await request.validate({
      schema: schema.create({
        id: schema.number([
          rules.unsigned(),
          rules.exists({
            column: 'id',
            table: 'modpack_versions',
          }),
        ]),
      }),
    })

    // Get the modpack instance
    const modpack = await Modpack.findOrFail(params.id)

    // Check if the user has the right to get the modpack
    const teamUser = await TeamUser
      .query()
      .preload('teamRole', (query) => {
        query.preload('permission')
      })
      .preload('team', (query => {
        query.preload('defaultPermission')
      }))
      .where('user_id', auth.user!.id)
      .andWhere('team_id', modpack.teamId)
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
      // Set the permission
      userPerms = teamUser.teamRole.permission
    } else {
      userPerms = teamUser.team.defaultPermission
    }

    const modpackVersion = await ModpackVersion
      .query()
      .where('id', data.id)
      .firstOrFail()

    const latestVersion = await ModpackVersion
      .query()
      .where('modpackId', modpack.id)
      .orderBy('created_at', 'desc')
      .firstOrFail()

    // Send the modpack version information and permissions
    response.json({
      ...modpackVersion.toJSON(),
      canEdit: latestVersion.id === modpackVersion.id,
      team: teamUser.team.toJSON(),
      userPerms,
    })
  }

  /**
   * Update modpack version
   */
  public async updateVersion ({ request, auth, response, params }: HttpContextContract) {
    // Validate datas
    const data = await request.validate({
      schema: schema.create({
        id: schema.number([
          rules.exists({
            column: 'id',
            table: 'modpack_versions',
          }),
        ]),
        version: schema.string({
          trim: true,
          escape: true,
        }, [
          rules.maxLength(20),
          rules.unique({
            column: 'version',
            table: 'modpack_versions',
            where: {
              modpack_id: params.id,
            },
            whereNot: {
              id: request.get().id,
            },
          }),
          rules.regex(/^\d\.\d\.\d(-[a-z]+)?$/),
        ]),
        summary: schema.string.optional({
          trim: true,
          escape: true,
        }, [
          rules.maxLength(200),
        ]),
        published: schema.boolean(),
      }),
    })

    // Get modpack instance from id
    const modpack = await Modpack
      .query()
      .preload('team', (query) => {
        query.preload('defaultPermission')
      })
      .where('id', params.id)
      .firstOrFail()

    const version = await ModpackVersion
      .query()
      .where('modpackId', modpack.id)
      .andWhere('id', data.id)
      .firstOrFail()

    const latestVersion = await ModpackVersion
      .query()
      .where('modpackId', modpack.id)
      .orderBy('created_at', 'desc')
      .firstOrFail()

    if (version.id !== latestVersion.id) {
      return response.status(403)
    }

    if (version.mcVersion !== null) {

    }

    // If the current user is the team owner
    if (modpack.team.ownerId === auth.user!.id) {
      version.version = data.version
      version.summary = data.summary ? data.summary : null
      version.published = version.mcVersion !== null ? data.published : false
      await version.save()

      // Give feedback
      return response.json(version)
    } else {
      // Get the current user permissions
      const currentUser = await TeamUser
        .query()
        .preload('teamRole', (query) => {
          query.preload('permission')
        })
        .where('teamId', modpack.teamId)
        .where('userId', auth.user!.id)
        .firstOrFail()

      // Check permissions
      if (currentUser.teamRole.permission.manage_modpacks || modpack.team.defaultPermission.manage_modpacks) {
        version.version = data.version
        version.summary = data.summary ? data.summary : null
        version.published = version.mcVersion !== null ? data.published : false
        await version.save()

        // Give feedback
        return response.json(version)
      } else {
        // Send access forbidden
        return response.status(403)
      }
    }
  }

  /**
   * Update minecraft data for modpack version
   */
  public async updateMinecraft ({ request, auth, response, params }: HttpContextContract) {
    // Validate datas
    const data = await request.validate({
      schema: schema.create({
        id: schema.number([
          rules.unsigned(),
          rules.exists({
            column: 'id',
            table: 'modpack_versions',
          }),
        ]),
        mcVersion: schema.string({
          trim: true,
          escape: true,
        }),
        enableForge: schema.boolean(),
        forgeVersion: schema.string.optional({
          trim: true,
          escape: true,
        }, [
          rules.requiredWhen('enableForge', '=', true),
        ]),
      }),
    })

    // Get the modpack instance
    const modpack = await Modpack.findOrFail(params.id)

    // Check if the user has the right to get the modpack
    const team = await TeamUser
      .query()
      .preload('teamRole', (query) => {
        query.preload('permission')
      })
      .preload('team', (query => {
        query.preload('defaultPermission')
      }))
      .where('user_id', auth.user!.id)
      .andWhere('team_id', modpack.teamId)
      .firstOrFail()

    const modpackVersion = await ModpackVersion
      .query()
      .where('id', data.id)
      .andWhere('modpack_id', params.id)
      .firstOrFail()

    // If the current user is the team owner
    if (team.team.ownerId === auth.user!.id) {
      modpackVersion.mcVersion = data.mcVersion
      modpackVersion.forgeVersion = data.enableForge ? data.forgeVersion as string : null
      await modpackVersion.save()

      // Give feedback
      return response.status(200)
    } else {
      // Get the current user permissions
      const currentUser = await TeamUser
        .query()
        .preload('teamRole', (query) => {
          query.preload('permission')
        })
        .where('teamId', modpack.teamId)
        .where('userId', auth.user!.id)
        .firstOrFail()

      // Check permissions
      if (currentUser.teamRole.permission.manage_modpacks || modpack.team.defaultPermission.manage_modpacks) {
        modpackVersion.mcVersion = data.mcVersion
        modpackVersion.forgeVersion = data.enableForge ? data.forgeVersion as string : null
        await modpackVersion.save()

        // Give feedback
        return response.status(200)
      } else {
        // Send access forbidden
        return response.status(403)
      }
    }
  }

  /**
   * Change modpack state function
   */
  public async updateState ({ params, request, response, auth }: HttpContextContract) {
    // Validate datas
    const data = await request.validate({
      schema: schema.create({
        state: schema.boolean(),
      }),
    })

    // Get modpack instance from id
    const modpack = await Modpack
      .query()
      .preload('team', (query) => {
        query.preload('defaultPermission')
      })
      .where('id', params.id)
      .firstOrFail()

    // If the current user is the team owner
    if (modpack.team.ownerId === auth.user!.id) {
      modpack.disabled = !data.state
      await modpack.save()

      // Give feedback
      return response.json(modpack)
    } else {
      // Get the current user permissions
      const currentUser = await TeamUser
        .query()
        .preload('teamRole', (query) => {
          query.preload('permission')
        })
        .where('teamId', modpack.teamId)
        .andWhere('userId', auth.user!.id)
        .firstOrFail()

      // Check permissions
      if (currentUser.teamRole.permission.manage_modpacks || modpack.team.defaultPermission.manage_modpacks) {
        modpack.disabled = !data.state
        await modpack.save()

        // Give feedback
        return response.json(modpack)
      } else {
        // Send access forbidden
        return response.status(403)
      }
    }
  }
}
