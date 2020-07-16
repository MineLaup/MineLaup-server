import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class AuthController {
  /**
   * Login function
   */
  public async login ({ auth, request }: HttpContextContract) {
    // Validate datas
    const data = await request.validate({
      schema: schema.create({
        username: schema.string(),
        password: schema.string(),
      }),
      cacheKey: request.url(),
    })

    await auth.attempt(data.username, data.password)
  }

  /**
   * Get user function
   */
  public async user ({ response, auth }: HttpContextContract) {
    return response.status(200).json(auth.user)
  }

  /**
   * Log out function
   */
  public async logout ({ auth, response }: HttpContextContract) {
    await auth.logout()

    return response.status(200)
  }

  /**
   * Update color theme function
   */
  public async setColor ({ request, auth, response }: HttpContextContract) {
    // Validate datas
    const data = await request.validate({
      schema: schema.create({
        // The color has to be a string with `dark` or `light` a value
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

    // Update the color theme
    auth.user!.colorMode = data.color
    auth.user!.save()

    // Send a feedback
    return response.status(200)
  }
}
