import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class TeamUsers extends BaseSchema {
  protected tableName = 'team_users'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').notNullable().references('users.id')
      table.integer('team_id').notNullable().references('teams.id')
      table.integer('role_id').notNullable().references('roles.id')
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
