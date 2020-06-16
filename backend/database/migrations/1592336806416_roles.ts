import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Roles extends BaseSchema {
  protected tableName = 'roles'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name', 50)
      table.integer('permission_id').notNullable().references('permissions.id')
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
