import BaseSchema from '@ioc:Adonis/Lucid/Schema'
export default class ModpackPermissions extends BaseSchema {
  protected tableName = 'modpack_permissions'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('modpack_id').notNullable().references('modpacks.id')
      table.integer('team_role_id').notNullable().references('team_roles.id')
      table.integer('permission_id').notNullable().references('permissions.id')
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
