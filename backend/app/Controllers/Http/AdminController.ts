import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import { schema } from '@ioc:Adonis/Core/Validator'

export default class AdminController {
  public async fetchUsers ({ request, response }: HttpContextContract) {
    const text: string = request.input('text') || ''
    const page: number = request.input('page') || 1
    const limit: number = request.input('limit') || 10

    let query: Partial<any> = {}

    if (text) {
      query = await User
        .query()
        .where('username', 'like', `%${text}%`)
        .orWhere('email', 'like', `%${text}%`)
        .orWhere('first_name', 'like', `%${text}%`)
        .orWhere('last_name', 'like', `%${text}%`)
        .paginate(page, limit)
    } else {
      query = await User
        .query()
        .paginate(page, limit)
    }

    response.send(query.toJSON())
  }

  public async deleteUser ({ request, response, auth }: HttpContextContract) {
    const data = await request.validate({
      schema: schema.create({
        id: schema.number(),
      }),
    })

    if (auth.user!.id === data.id) {
      return response.status(403)
    }

    const user = await User.find(data.id)

    if (!user) {
      return response.status(404)
    }

    await user.delete()
  }
}
