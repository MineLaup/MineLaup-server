import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Launcher from 'App/Models/Launcher'
import Modpack from 'App/Models/Modpack'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import ModpackVersion from 'App/Models/ModpackVersion'

export default class ApisController {
  public async getLauncherInfo ({ request, response }: HttpContextContract) {
    const launcher = await Launcher
      .query()
      .preload('modpacks', (query) => {
        query.select('id', 'name', 'summary')
        query.where('disabled', false)
      })
      .select('id', 'name', 'summary')
      .where('id', request.launcher!.id)
      .first()

    if (!launcher) {
      return response.status(404)
    }

    return response.json(launcher)
  }

  public async getModpackInfo ({ request, response }: HttpContextContract) {
    // Validate datas
    const data = await request.validate({
      schema: schema.create({
        id: schema.number([
          rules.exists({
            column: 'id',
            table: 'modpacks',
          }),
          rules.unsigned(),
        ]),
      }),
    })

    const modpack = await Modpack
      .query()
      .preload('version', (query) => {
        query.where('published', true)
        query.select('id', 'version', 'summary', 'created_at')
      })
      .whereNot('disabled', true)
      .select('id', 'name', 'summary')
      .where('id', data.id)
      .first()

    if (!modpack) {
      return response.status(404)
    }

    if (modpack.disabled) {
      return response.forbidden('Modpack disabled')
    }

    return response.json(modpack)
  }

  public async getVersionInfo ({ request, response }: HttpContextContract) {
    let data: Partial<any>
    try {
    // Validate datas
      data = await request.validate({
        schema: schema.create({
          id: schema.number([
            rules.exists({
              column: 'id',
              table: 'modpacks',
            }),
            rules.unsigned(),
          ]),
          v: schema.number([
            rules.exists({
              column: 'id',
              table: 'modpack_versions',
            }),
          ]),
        }),
      })
    } catch(e) {
      return response.status(404)
    }

    const version = await ModpackVersion
      .query()
      .where('published', true)
      .select(
        'id',
        'version',
        'summary',
        'mc_version',
        'forge_version',
        'created_at'
      )
      .where('id', data.v)
      .first()

    if (!version) {
      return response.status(404)
    }

    return response.json(version)
  }

  /**
   * Get mods from a version function
   */
  public async getVersionMods ({ request, response }: HttpContextContract) {
    let data: Partial<any>
    try {
    // Validate datas
      data = await request.validate({
        schema: schema.create({
          id: schema.number([
            rules.exists({
              column: 'id',
              table: 'modpacks',
            }),
            rules.unsigned(),
          ]),
          v: schema.number([
            rules.exists({
              column: 'id',
              table: 'modpack_versions',
            }),
          ]),
        }),
      })
    } catch(e) {
      return response.status(404)
    }

    const version = await ModpackVersion
      .query()
      .select('id', 'version', 'mc_version', 'forge_version')
      .where('published', true)
      .preload('mods')
      .where('id', data.v)
      .first()

    if (!version) {
      return response.status(404)
    }

    return response.json(version)
  }
}
