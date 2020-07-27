import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import User from 'App/Models/User'

export default class AuthController {
  /**
   * Login function
   */
  public async login ({ auth, request }: HttpContextContract) {
    // Validate datas
    const data = await request.validate({
      schema: schema.create({
        username: schema.string({}, [
          rules.required(),
          rules.regex(/^[a-z0-9_-]+$/),
        ]),
        password: schema.string({}, [
          rules.required(),
        ]),
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

  /**
   * Update user informations
   */
  public async updateUser ({ request, auth, response }: HttpContextContract) {
    // Validate datas
    const data = await request.validate({
      schema: schema.create({
        username: schema.string({
          escape: true,
          trim: true,
        }, [
          // The username has to be unique, with a max length of 45 characters and to be alphanumeric
          rules.regex(/^[a-z0-9_-]+$/),
          rules.maxLength(45),
          rules.unique({
            column: 'username',
            table: 'users',
            whereNot: {
              id: auth.user!.id,
            },
          }),
        ]),
        email: schema.string({
          escape: true,
          trim: true,
        }, [
          // The email has to be unique
          rules.email(),
          rules.unique({
            column: 'username',
            table: 'users',
            whereNot: {
              id: auth.user!.id,
            },
          }),
        ]),
        first_name: schema.string.optional({
          trim: true,
          escape: true,
        }),
        last_name: schema.string.optional({
          trim: true,
          escape: true,
        }),
        language: schema.string.optional({
          trim: true,
          escape: true,
        },
        [
          rules.maxLength(6),
          rules.regex(/^(fr|en)$/),
        ]),
      }),
    })

    // Update user settings
    await User
      .query()
      .where('id', auth.user!.id)
      .update(data)

    // Given feedback
    return response.status(200)
  }
}
