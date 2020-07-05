import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import User from 'App/Models/User'

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

  public async setColor ({ request, auth, response }: HttpContextContract) {
    const data = await request.validate({
      schema: schema.create({
        color: schema.string({
          escape: true,
          trim: true,
        },
        [
          rules.required(),
          rules.regex(/^(dark|light)$/),
        ]),
      }),
    })

    const user = await User.find(auth.user!.id)

    if (user) {
      user.colorMode = data.color
      user.save()
      return response.status(200)
    }

    return response.status(401)
  }
}
