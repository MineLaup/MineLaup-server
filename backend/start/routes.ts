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
  Route.get('/', 'TeamsController.list')
  Route.post('/', 'TeamsController.create')
  Route.get('/:id', 'TeamsController.get').where('id', /^[0-9]+$/)
  Route.get('/:id/users', 'TeamsController.fetchUsers').where('id', /^[0-9]+$/)
  Route.delete('/:id', 'TeamsController.deleteTeam').where('id', /^[0-9]+$/)
}).prefix('/teams').middleware('auth')

Route.group(() => {
  Route.get('/users', 'AdminController.fetchUsers')
  Route.delete('/user', 'AdminController.deleteUser')
  Route.post('/user', 'AdminController.createUser')
}).prefix('/admin').middleware(['auth', 'admin'])

Route.get('/email', async ({ view }) => {
  return view.render('mail/set_password', {
    username: 'test',
    hostname: (process.env.HTTPS === 'true' ? 'https://' : 'http://') + process.env.HOSTNAME,
    api_host: `${process.env.HOST}:${process.env.PORT}`,
    token: hat(),
  })
})
