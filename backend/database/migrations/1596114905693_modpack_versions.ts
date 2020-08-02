import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ModpackVersions extends BaseSchema {
  protected tableName = 'modpack_versions'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('version', 20).unique().notNullable()
      table.string('summary', 200)
      table.integer('modpack_id').notNullable().references('modpacks.id')
      table.boolean('published').defaultTo(false).notNullable()
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
