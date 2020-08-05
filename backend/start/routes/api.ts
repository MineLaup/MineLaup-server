import Route from '@ioc:Adonis/Core/Route'

/**
 * API ROUTES
 */
Route.group(() => {
  Route.get('/', 'ApisController.getLauncherInfo')
  Route.get('/modpack', 'ApisController.getModpackInfo')
  Route.get('/version', 'ApisController.getVersionInfo')
}).prefix('/game').middleware('api')
