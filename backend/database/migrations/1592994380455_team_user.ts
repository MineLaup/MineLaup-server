import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class TeamUser extends BaseSchema {
  protected tableName = 'team_user'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').references('users.id').notNullable()
      table.integer('team_id').references('teams.id').notNullable()
      table.integer('team_role_id').references('team_roles.id').nullable()
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
