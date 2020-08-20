import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Mod extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public modpackVersionId: number

  @column()
  public modId: number

  @column()
  public fileId: number

  @column()
  public hash: string

  @column()
  public optional: boolean
}
