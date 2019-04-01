'use strict'

const User = use('App/Models/User')
const Hash = use('Hash')

class AuthenticationController {
  async register ({ request, auth, response }) {
    const userData = request.only(['username', 'email', 'password'])

    try {
      const user = await User.create(userData)

      const token = await auth.generate(user)

      return response.json({
        status: 'success',
        data: token
      })
    } catch (error) {
      return response.status(400).json({
        status: 'error',
        message: 'There was a problem creating the user, please try again later.'
      })
    }
  }

  async login ({ request, auth, response }) {
    const { email, password } = request.only(['email', 'password'])

    try {
      const token = await auth.attempt(email, password)

      return response.json({
        status: 'success',
        data: token
      })
    } catch (error) {
      response.status(400).json({
        status: 'error',
        message: 'Invalid email/password.'
      })
    }
  }

  async changePassword ({ request, auth, response }) {
    // get currently authenticated user
    const user = auth.current.user
    let p = await Hash.make(request.input('newPassword'))

    // verify if current password matches
    const verifyPassword = await Hash.verify(
        request.input('password'),
        user.password
    )

    // display appropriate message
    if (!verifyPassword) {
        return response.status(400).json({
            status: 'error',
            message: 'Current password could not be verified! Please try again.'
        })
    }

    user.password = request.input('newPassword')
    await user.save()

    return response.json({
        status: 'success',
        message: 'Password updated!'
    })
  }

  async me ({ auth, response }) {
    return response.json({
      status: 'success',
      data: auth.user
    })
  }
}

module.exports = AuthenticationController
