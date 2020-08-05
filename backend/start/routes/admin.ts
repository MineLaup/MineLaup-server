import Route from '@ioc:Adonis/Core/Route'

/**
 * ADMIN ROUTES
 */
Route.group(() => {
  // Get users list
  Route.get('/users', 'AdminController.fetchUsers')
  // Get user information
  Route.get('/user', 'AdminController.getUser')
  // Delete an user
  Route.delete('/user', 'AdminController.deleteUser')
  // Create an user
  Route.post('/user', 'AdminController.createUser')
  // Update an user state (activated/disabled)
  Route.post('/user/state', 'AdminController.updateState')
  // Update an user
  Route.put('/user', 'AdminController.updateUser')
}).prefix('/admin').middleware(['auth', 'admin'])
