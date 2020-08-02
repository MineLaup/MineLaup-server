import { BaseModel, column, belongsTo, BelongsTo, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import ModpackVersion from './ModpackVersion'
import Team from './Team'
export default class Modpack extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public teamId: number

  @column()
  public launcherId: number | null

  @column()
  public name: string

  @column()
  public summary: string

  @column()
  public disabled: boolean

  @hasMany(() => ModpackVersion)
  public version: HasMany<typeof ModpackVersion>

  @belongsTo(() => Team)
  public team: BelongsTo<typeof Team>
}
