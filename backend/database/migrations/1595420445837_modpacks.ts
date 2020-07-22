import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Modpack extends BaseSchema {
  protected tableName = 'modpacks'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('team_id').unique().references('teams.id').notNullable()
      table.integer('launcher_id').unique().references('launcher.id').nullable()
      table.string('name', 45).unique().notNullable()
      table.string('summary', 2048)
      table.boolean('disabled').defaultTo(false)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
