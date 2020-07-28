import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Team from './Team'

export default class Launcher extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public teamId: number

  @belongsTo(() => Team)
  public team: BelongsTo<typeof Team>

  @column()
  public name: string

  @column()
  public summary: string

  @column()
  public disabled: boolean

  @column()
  public apiKey: string
}
