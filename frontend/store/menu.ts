import { Module, VuexModule, Mutation } from 'vuex-module-decorators'

@Module({
  name: 'menu',
  stateFactory: true,
  namespaced: true,
})
export default class Menu extends VuexModule {
  title: string = ''
  list: Array<Partial<any>> = []
  additional: Partial<any> = {}

  @Mutation
  setTitle(title: string) {
    this.title = title
  }

  @Mutation
  setList(list: Array<Partial<any>>) {
    this.list = list
  }

  @Mutation
  setAdditional(item: Partial<any>) {
    this.additional = item
  }

  @Mutation
  clear() {
    this.title = ''
    this.list = []
    this.additional = []
  }

  get getAdditional() {
    return this.additional
  }

  get hasAdditional() {
    return Object.keys(this.additional).length !== 0
  }

  get getList() {
    return this.list
  }

  get getTitle() {
    return this.title
  }
}
