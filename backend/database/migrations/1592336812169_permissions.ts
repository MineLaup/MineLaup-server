import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Permissions extends BaseSchema {
  protected tableName = 'permissions'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.boolean('manage_team').notNullable().defaultTo(false)
      table.boolean('manage_launchers').notNullable().defaultTo(false)
      table.boolean('manage_modpacks').notNullable().defaultTo(false)
      table.boolean('manage_users').notNullable().defaultTo(false)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
