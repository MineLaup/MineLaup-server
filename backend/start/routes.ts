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

Route.get('/', async () => {
  return { hello: 'world' }
})

Route.group(() => {
  Route.post('/auth', 'AuthController.login')
  Route.get('/auth', 'AuthController.user').middleware('auth')
  Route.delete('/auth', 'AuthController.logout').middleware('auth')
  Route.post('/color-mode', 'AuthController.setColor').middleware('auth')
}).prefix('/user')

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

Route.group(() => {
  Route.get('/users', 'AdminController.fetchUsers')
  Route.get('/user', 'AdminController.getUser')
  Route.delete('/user', 'AdminController.deleteUser')
  Route.post('/user', 'AdminController.createUser')
  Route.post('/user/state', 'AdminController.updateState')
  Route.put('/user', 'AdminController.updateUser')
}).prefix('/admin').middleware(['auth', 'admin'])

Route.get('/email', async ({ view }) => {
  return view.render('mail/set_password', {
    username: 'test',
    hostname: (process.env.HTTPS === 'true' ? 'https://' : 'http://') + process.env.HOSTNAME,
    api_host: `${process.env.HOST}:${process.env.PORT}`,
    token: hat(),
  })
})
