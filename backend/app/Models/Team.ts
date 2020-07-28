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

export default class Team extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public summary: string

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

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeDelete()
  public static async deletePermission (team: Team) {
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
  }
}
