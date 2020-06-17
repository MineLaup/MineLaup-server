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

Route.get('/', async () => {
  return { hello: 'world' }
})

Route.group(() => {
  Route.post('/auth', 'AuthController.login')
  Route.get('/auth', 'AuthController.user').middleware('auth')
  Route.delete('/auth', 'AuthController.logout').middleware('auth')
}).prefix('/user')

Route.group(() => {
  Route.get('/', 'TeamsController.list')
  Route.post('/', 'TeamsController.create')
  Route.get('/:id', 'TeamsController.get').where('id', /^[0-9]+$/)
}).prefix('/teams').middleware('auth')
