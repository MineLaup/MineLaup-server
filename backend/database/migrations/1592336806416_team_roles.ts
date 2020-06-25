import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class TeamRoles extends BaseSchema {
  protected tableName = 'team_roles'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name', 50)
      table.integer('permission_id').notNullable().references('permissions.id').onDelete('cascade')
      table.integer('team_id').notNullable().references('teams.id')
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
