import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Mail from '@ioc:Adonis/Addons/Mail'
import hat from 'hat'

export default class AdminController {
  /**
   * Fetch user function
   */
  public async fetchUsers ({ request, response }: HttpContextContract) {
    const text: string = request.input('text') || ''
    const page: number = request.input('page') || 1
    const limit: number = request.input('limit') || 10

    let query: Partial<any> = {}

    // If a search text is provided
    if (text) {
      // Search an user by the text and return the list
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

  /**
   * Delete user function
   */
  public async deleteUser ({ request, response, auth }: HttpContextContract) {
    // Validate data
    const data = await request.validate({
      schema: schema.create({
        id: schema.number(),
      }),
    })

    // If the deleted user and the current user are the same, cancel the process
    if (auth.user!.id === data.id) {
      return response.status(403)
    }

    // Get the user instance
    const user = await User.findOrFail(data.id)

    // Delete the instance
    await user.delete()

    // Give a feedback
    return response.status(200)
  }

  /**
   * Get an user function
   */
  public async getUser ({ request, response }: HttpContextContract) {
    // Validate the data (check if the id is a number and exist in the user table)
    const data = await request.validate({
      schema: schema.create({
        id: schema.number([
          rules.exists({
            column: 'id',
            table: 'users',
          }),
        ]),
      }),
    })

    // Get the user instance
    const user = await User.findOrFail(data.id)

    // Give back the user information
    return response.json(user.toJSON())
  }

  /**
   * Create user function
   */
  public async createUser ({ request, response }: HttpContextContract) {
    // Validate given datas
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
          }),
        ]),
        email: schema.string({
          escape: true,
          trim: true,
        }, [
          // The email has to be unique
          rules.email(),
          rules.unique({
            column: 'email',
            table: 'users',
          }),
        ]),
        // The role has to be a string which contain a single number
        role: schema.string({
          escape: true,
          trim: true,
        },
        [
          rules.regex(/^[0-3]$/),
        ]),
      }),
    })

    // Create the user
    await User.create({
      username: data.username,
      email: data.email,
      // Fill a random password
      password: Buffer.from(Math.random().toString()).toString('hex'),
      disabled: true,
    })

    // Generate an unique random token
    const token = hat()

    // Send a mail to the user to signal him that an account has been created
    await Mail.use('smtp').sendLater(message => {
      message.to(data.email),
      message.from(`minelaup@${process.env.HOSTNAME}`)
      message.subject('Your account have been registered !')
      message.htmlView('mail/set_password', {
        username: data.username,
        hostname: (process.env.HTTPS === 'true' ? 'https://' : 'http://') + process.env.HOSTNAME,
        token: token,
      })
    })
      .then((data) => {
        console.log(data)
      })
      .catch(error => {
        console.error(error)
      })

    response.status(200)
  }

  /**
   * Update user state function
   */
  public async updateState ({ request, response, auth }: HttpContextContract) {
    // Validate datas
    const data = await request.validate({
      schema: schema.create({
        // The id has to be an unsigned number and exist in the user table
        id: schema.number([
          rules.required(),
          rules.unsigned(),
          rules.exists({
            column: 'id',
            table: 'users',
          }),
        ]),
        // The state has to be a boolean
        state: schema.boolean([
          rules.required(),
        ]),
      }),
    })

    // If the current user and the updated user are the same, cancel the process
    if (auth.user!.id === data.id) {
      return response.status(403)
    }

    // Get the user instance
    const user = await User.findOrFail(data.id)

    // Update the value
    user.disabled = !data.state
    await user.save()

    // Give a feedback
    return response.status(200)
  }

  /**
   * Update user function
   */
  public async updateUser ({ request, response }: HttpContextContract) {
    // Validate dates
    const data = await request.validate({
      schema: schema.create({
        // The ID has to exist in the user table
        id: schema.number([
          rules.exists({
            column: 'id',
            table: 'users',
          }),
        ]),
        username: schema.string({
          escape: true,
          trim: true,
        }, [
          // The username has to be unique, with a max length of 45 characters and to be alphanumeric
          rules.regex(/^[a-z0-9_-]+$/),
          rules.maxLength(45),
        ]),
        first_name: schema.string({
          escape: true,
          trim: true,
        }),
        last_name: schema.string({
          escape: true,
          trim: true,
        }),
        email: schema.string({
          escape: true,
          trim: true,
        }, [
          rules.email(),
        ]),
        role: schema.string({
          escape: true,
          trim: true,
        },
        [
          rules.regex(/^[0-3]$/),
        ]),
      }),
    })

    // Update the user with the given datas
    await User.query().where('id', data.id).update(data)

    // Send feedback
    return response.status(200)
  }
}
