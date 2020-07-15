import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Mail from '@ioc:Adonis/Addons/Mail'
import hat from 'hat'

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

    return response.status(200)
  }

  public async getUser ({ request, response }: HttpContextContract) {
    const data = await request.validate({
      schema: schema.create({
        id: schema.number(),
      }),
    })

    const user = await User.find(data.id)

    if (!user) {
      return response.status(404)
    }

    return response.json(user.toJSON())
  }

  public async createUser ({ request, response }: HttpContextContract) {
    const data = await request.validate({
      schema: schema.create({
        username: schema.string({
          escape: true,
          trim: true,
        }, [
          rules.alpha(),
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
          rules.email(),
          rules.unique({
            column: 'email',
            table: 'users',
          }),
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

    await User.create({
      username: data.username,
      email: data.email,
      password: Buffer.from(Math.random().toString()).toString('hex'),
      disabled: true,
    })

    const token = hat()

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

  public async updateState ({ request, response, auth }: HttpContextContract) {
    const data = await request.validate({
      schema: schema.create({
        id: schema.number([
          rules.required(),
          rules.unsigned(),
        ]),
        state: schema.boolean([
          rules.required(),
        ]),
      }),
    })

    if (auth.user!.id === data.id) {
      return response.status(403)
    }

    const user = await User.find(data.id)

    if (!user) {
      return response.status(404)
    }

    user.disabled = !data.state
    await user.save()

    return response.status(200)
  }

  public async updateUser ({ request, response }: HttpContextContract) {
    const data = await request.validate({
      schema: schema.create({
        id: schema.number(),
        username: schema.string({
          escape: true,
          trim: true,
        }, [
          rules.alpha(),
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

    const user = await User.find(data.id)

    if (!user) {
      return response.status(404)
    }

    await User.query().where('id', data.id).update(data)

    return response.status(200)
  }
}
