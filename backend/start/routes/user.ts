import Route from '@ioc:Adonis/Core/Route'

/**
 *  USER ROUTES
 */
Route.group(() => {
  /**
   * Auth management
   */
  // Login
  Route.post('/auth', 'AuthController.login')
  // Get user
  Route.get('/auth', 'AuthController.user').middleware('auth')
  // Logout
  Route.delete('/auth', 'AuthController.logout').middleware('auth')

  /**
   * User update
   */
  // Set color theme
  Route.post('/color-mode', 'AuthController.setColor').middleware('auth')
  // Update user informations
  Route.put('/update', 'AuthController.updateUser').middleware('auth')
}).prefix('/user')
