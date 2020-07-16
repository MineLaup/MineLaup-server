import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Permission extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public manage_team: boolean

  @column()
  public manage_launchers: boolean

  @column()
  public manage_modpacks: boolean

  @column()
  public manage_users: boolean
}
