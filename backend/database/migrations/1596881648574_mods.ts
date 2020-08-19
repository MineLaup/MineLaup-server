import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Mods extends BaseSchema {
  protected tableName = 'mods'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('modpack_version_id').notNullable().references('modpack_versions_id')
      table.integer('mod_id').notNullable()
      table.integer('file_id').notNullable()
      table.string('hash').nullable()
      table.string('optional').notNullable().defaultTo(false)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
