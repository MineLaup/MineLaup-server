import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  belongsTo,
  BelongsTo,
  HasMany,
  hasMany,
  beforeDelete,
} from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import TeamRole from './TeamRole'
import Permission from './Permission'
import Launcher from './Launcher'
import Modpack from './Modpack'
import TeamUser from './TeamUser'

export default class Team extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public summary: string | null

  @belongsTo(() => User, {
    foreignKey: 'ownerId',
  })
  public owner: BelongsTo<typeof User>

  @column()
  public ownerId: number

  @hasMany(() => TeamRole)
  public roles: HasMany<typeof TeamRole>

  @column()
  public permissionId: number

  @belongsTo(() => Permission)
  public defaultPermission: BelongsTo<typeof Permission>

  @hasMany(() => Launcher)
  public launchers: HasMany<typeof Launcher>

  @hasMany(() => Modpack)
  public modpacks: HasMany<typeof Modpack>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeDelete()
  public static async deleteRelations (team: Team) {
    const perm = await Permission.find(team.permissionId)

    if (perm) {
      await perm.delete()
    }

    const roles = await TeamRole
      .query()
      .preload('permission')
      .where('team_id', team.id)

    roles.forEach(async role => {
      await role.permission.delete()
      await role.delete()
    })

    await TeamUser
      .query()
      .where('team_id', team.id)
      .delete()

    await Modpack
      .query()
      .where('team_id', team.id)
      .delete()

    await Launcher
      .query()
      .where('team_id', team.id)
      .delete()
  }
}
