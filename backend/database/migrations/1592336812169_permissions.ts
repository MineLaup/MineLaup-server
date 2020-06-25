import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Permissions extends BaseSchema {
  protected tableName = 'permissions'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.boolean('can_create').notNullable().defaultTo(false)
      table.boolean('can_read').notNullable().defaultTo(true)
      table.boolean('can_update').notNullable().defaultTo(false)
      table.boolean('can_delete').notNullable().defaultTo(false)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
