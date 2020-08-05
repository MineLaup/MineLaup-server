import Route from '@ioc:Adonis/Core/Route'

/**
 * TEAMS ROUTES
 */
Route.group(() => {
  /**
   * Team management
   */
  // List teams
  Route.get('/', 'TeamsController.list')
  // Create team
  Route.post('/', 'TeamsController.create')
  // Get team info
  Route.get('/:id', 'TeamsController.get').where('id', /^[0-9]+$/)
  // Get team users
  Route.get('/:id/users', 'TeamsController.fetchUsers').where('id', /^[0-9]+$/)
  // Delete team
  Route.delete('/:id', 'TeamsController.deleteTeam').where('id', /^[0-9]+$/)

  /**
   * Users management
   */
  // Invite a user to a team
  Route.post('/:id/user', 'TeamsController.inviteUser').where('id', /^[0-9]+$/)
  // Remove a user from a team
  Route.delete('/:id/user', 'TeamsController.deleteUser').where('id', /^[0-9]+$/)

  /**
   * Role management
   */
  // Get team roles
  Route.get('/:id/roles', 'TeamsController.getRoles').where('id', /^[0-9]+$/)
  // Save team roles
  Route.put('/:id/roles', 'TeamsController.saveRoles').where('id', /^[0-9]+$/)
  // Add role
  Route.post('/:id/roles', 'TeamsController.addRole').where('id', /^[0-9]+$/)
  // Delete role
  Route.delete('/:id/roles', 'TeamsController.deleteRole').where('id', /^[0-9]+$/)
}).prefix('/teams').middleware('auth')
