import { BaseModel, BelongsTo, belongsTo, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import Team from './Team'
import Modpack from './Modpack'

export default class Launcher extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public teamId: number

  @belongsTo(() => Team)
  public team: BelongsTo<typeof Team>

  @hasMany(() => Modpack)
  public modpacks: HasMany<typeof Modpack>

  @column()
  public name: string

  @column()
  public summary: string

  @column()
  public disabled: boolean

  @column()
  public apiKey: string
}
