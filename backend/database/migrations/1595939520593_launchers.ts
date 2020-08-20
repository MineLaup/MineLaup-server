import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Launchers extends BaseSchema {
  protected tableName = 'launchers'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('team_id').notNullable().references('teams.id')
      table.string('name', 50).unique().notNullable()
      table.string('summary', 2000).nullable()
      table.boolean('disabled').defaultTo(false)
      table.string('api_key').nullable().unique()
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
