import Route from '@ioc:Adonis/Core/Route'

/**
 * API ROUTES
 */
Route.group(() => {
  Route.get('/', 'ApisController.getLauncherInfo')
  Route.get('/modpack', 'ApisController.getModpackInfo')
  Route.get('/version', 'ApisController.getVersionInfo')
  Route.get('/version/mods', 'ApisController.getVersionMods')
}).prefix('/game').middleware('api')
