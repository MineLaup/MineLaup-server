import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import TeamRole from './TeamRole'
import Permission from './Permission'
import Modpack from './Modpack'

export default class ModpackPermission extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public modpackId: string

  @belongsTo(() => Modpack)
  public modpack: BelongsTo<typeof Modpack>

  @column()
  public teamRoleId: string

  @belongsTo(() => TeamRole)
  public role: BelongsTo<typeof TeamRole>

  @column()
  public permissionId: string

  @belongsTo(() => Permission)
  public permission: BelongsTo<typeof Permission>
}
