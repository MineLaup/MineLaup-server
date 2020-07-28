/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes/index.ts` as follows
|
| import './cart'
| import './customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'
import hat from 'hat'
import * as pkg from '../package.json'

/**
 * APP ROOT
 */
Route.get('/', async ({response}) => {
  return response.json({
    name: pkg.name,
    version: pkg.version,
    author: pkg.author,
  })
})

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

/**
 * LAUNCHER ROUTES
 */
Route.group(() => {
  // Get launcher list
  Route.get('/launchers', 'LaunchersController.list')
  // Create a launcher
  Route.post('/launchers', 'LaunchersController.create')
  // Get launcher information
  Route.get('/launcher/:id', 'LaunchersController.get')
  // Delete a launcher
  Route.delete('/launcher/:id', 'LaunchersController.delete')
  // Regenerate API key
  Route.post('/launcher/:id/regenerate', 'LaunchersController.regenerate')
}).middleware('auth')

/**
 * EMAIL TESTING ROUTE
 */
Route.get('/email', async ({ view }) => {
  return view.render('mail/set_password', {
    username: 'test',
    hostname: (process.env.HTTPS === 'true' ? 'https://' : 'http://') + process.env.HOSTNAME,
    api_host: `${process.env.HOST}:${process.env.PORT}`,
    token: hat(),
  })
})
