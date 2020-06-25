import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Permission extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public can_create: boolean

  @column()
  public can_read: boolean

  @column()
  public can_update: boolean

  @column()
  public can_delete: boolean
}
