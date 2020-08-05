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
import * as pkg from '../../package.json'

import './admin'
import './api'
import './launcher'
import './modpack'
import './team'
import './user'

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

