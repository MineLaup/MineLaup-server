import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Team from './Team'
import TeamRole from './TeamRole'

export default class TeamUser extends BaseModel {
  public static table = 'team_user'

  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @column()
  public teamId: number

  @belongsTo(() => Team)
  public team: BelongsTo<typeof Team>

  @column()
  public teamRoleId: number | null

  @belongsTo(() => TeamRole)
  public teamRole: BelongsTo<typeof TeamRole>
}
