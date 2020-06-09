import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'

export default class AuthController {
  public async login ({ auth, request }: HttpContextContract) {
    const userSchema = schema.create({
      username: schema.string(),
      password: schema.string(),
    })

    const data = await request.validate({
      schema: userSchema,
      cacheKey: request.url(),
    })

    await auth.attempt(data.username, data.password)
  }

  public async user ({ response, auth }: HttpContextContract) {
    const user = auth.user

    response.status(200).json(user)
  }

  public async logout ({ auth }: HttpContextContract) {
    await auth.logout()

    return 200
  }
}
