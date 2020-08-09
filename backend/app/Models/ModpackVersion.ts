import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Modpack from './Modpack'
import Mod from './Mod'

export default class ModpackVersion extends BaseModel {
  protected table_name = ''

  @column({ isPrimary: true })
  public id: number

  @column()
  public version: string

  @column()
  public summary: string | null

  @column()
  public modpackId: number

  @belongsTo(() => Modpack)
  public modpack: BelongsTo<typeof Modpack>

  @column()
  public published: boolean

  @column()
  public mcVersion: string | null

  @column()
  public forgeVersion: string | null

  @hasMany(() => Mod)
  public mods: HasMany<typeof Mod>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
