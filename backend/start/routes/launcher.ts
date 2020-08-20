import Route from '@ioc:Adonis/Core/Route'

/**
 * LAUNCHER ROUTES
 */
Route.group(() => {
  // Get launcher list
  Route.get('/launchers', 'LaunchersController.list')
  // Create a launcher
  Route.post('/launchers', 'LaunchersController.create')
  // Get launcher information
  Route.get('/launcher/:id', 'LaunchersController.get').where('id', /^[0-9]+$/)
  // Update a launcher
  Route.put('/launcher/:id', 'LaunchersController.update').where('id', /^[0-9]+$/)
  // Delete a launcher
  Route.delete('/launcher/:id', 'LaunchersController.delete').where('id', /^[0-9]+$/)
  // Regenerate API key
  Route.post('/launcher/:id/regenerate', 'LaunchersController.regenerate').where('id', /^[0-9]+$/)
  // List modpacks for launchers
  Route.get('/launchers/list-modpacks', 'LaunchersController.listModpacks')
  // Add modpack to the launcher's modpack list
  Route.post('/launcher/:id/modpacks', 'LaunchersController.addModpack').where('id', /^[0-9]+$/)
  // Remove modpack from a launcher
  Route.delete('/launcher/:id/modpacks', 'LaunchersController.removeModpack').where('id', /^[0-9]+$/)
  // Change launcher state
  Route.put('/launcher/:id/state', 'LaunchersController.updateState').where('id', /^[0-9]+$/)
}).middleware('auth')
