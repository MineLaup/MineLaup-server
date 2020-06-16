import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Team from './Team'
import Role from './Role'

export default class TeamUser extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @column()
  public teamId: number

  @column()
  public roleId: number

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @belongsTo(() => Team)
  public team: BelongsTo<typeof Team>

  @belongsTo(() => Role)
  public role: BelongsTo<typeof Role>
}
