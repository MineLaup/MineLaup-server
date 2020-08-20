/**
 * Contract source: https://git.io/JfefG
 *
 * Feel free to let us know via PR, if you find something broken in this contract
 * file.
 */

import Launcher from 'App/Models/Launcher'

declare module '@ioc:Adonis/Core/Request' {
  interface RequestContract {
    launcher?: Launcher
  }
}
