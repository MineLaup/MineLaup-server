import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

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
}
