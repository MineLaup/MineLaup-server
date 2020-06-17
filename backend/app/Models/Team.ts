import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo, manyToMany, ManyToMany } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Role from './Role'

export default class Team extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public summary: string

  @belongsTo(() => User, {
    foreignKey: 'ownerId',
  })
  public owner: BelongsTo<typeof User>

  @column()
  public ownerId: number

  @manyToMany(() => User)
  public users: ManyToMany<typeof User>

  @manyToMany(() => Role, {
    pivotTable: 'team_user',
  })
  public roles: ManyToMany<typeof Role>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
