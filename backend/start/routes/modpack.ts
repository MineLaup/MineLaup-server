import Route from '@ioc:Adonis/Core/Route'

/**
 * MODPACKS ROUTES
 */
Route.group(() => {
  /**
   * Modpack management
   */
  // List modpacks
  Route.get('/modpacks', 'ModpacksController.getList')
  // Get a modpack
  Route.get('/modpack/:id', 'ModpacksController.get').where('id', /^[0-9]+$/)
  // Create modpacks
  Route.post('/modpacks', 'ModpacksController.create')
  // Delete modpack
  Route.delete('/modpack/:id', 'ModpacksController.delete').where('id', /^[0-9]+$/)
  // Create modpack version
  Route.post('/modpack/:id/versions', 'ModpacksController.addVersion').where('id', /^[0-9]+$/)
  // Create modpack version
  Route.put('/modpack/:id/version', 'ModpacksController.updateVersion').where('id', /^[0-9]+$/)
  // List modpack versions
  Route.get('/modpack/:id/versions', 'ModpacksController.listVersions').where('id', /^[0-9]+$/)
  // delete a version
  Route.delete('/modpack/:id/version', 'ModpacksController.deleteVersion').where('id', /^[0-9]+$/)
  // get a version
  Route.get('/modpack/:id/version', 'ModpacksController.getVersion').where('id', /^[0-9]+$/)

  /**
   * Modpack Minecraft informations
   */
  // Get modpack Minecraft informations
  Route.post('/modpack/:id/minecraft', 'ModpacksController.updateMinecraft').where('id', /^[0-9]+$/)
  // Change modpack state
  Route.put('/modpack/:id/state', 'ModpacksController.updateState').where('id', /^[0-9]+$/)
  // Get mods from modpack
  Route.get('/modpack/:id/mods', 'ModsController.getMods').where('id', /^[0-9]+$/)
  // Get mod
  Route.get('/modpack/:id/mod/:mid', 'ModsController.getMod').where('id', /^[0-9]+$/).where('mid', /^[0-9]+$/)
  // Add mod to modpack
  Route.post('/modpack/:id/mods', 'ModsController.addMod').where('id', /^[0-9]+$/)
  // Remove mod to modpack
  Route.delete('/modpack/:id/mods', 'ModsController.removeMod').where('id', /^[0-9]+$/)
  // Change mod state
  Route.post('/modpack/:id/mods/state', 'ModsController.modState').where('id', /^[0-9]+$/)
}).middleware('auth')
