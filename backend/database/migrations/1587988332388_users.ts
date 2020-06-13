import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UsersSchema extends BaseSchema {
  protected tableName = 'users'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('username', 45).unique().notNullable()
      table.string('email', 255).unique().notNullable()
      table.string('password', 180).notNullable()
      table.string('first_name').nullable()
      table.string('last_name').nullable()
      table.string('language', 4).defaultTo('en').notNullable()
      table.enum('color-mode', ['light', 'dark']).defaultTo('light').notNullable()
      table.boolean('disabled').defaultTo(false).notNullable()
      table.string('remember_me_token').nullable()
      table.integer('role').defaultTo(0)
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
