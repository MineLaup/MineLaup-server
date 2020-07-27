import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import Team from './Team'
export default class Modpack extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public teamId: number

  @column()
  public launcherId: number

  @column()
  public name: string

  @column()
  public summary: string

  @column()
  public disabled: boolean

  @belongsTo(() => Team)
  public team: BelongsTo<typeof Team>
}
