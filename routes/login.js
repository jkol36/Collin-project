const User = require('../models/User')
const bcrypt = require('bcrypt')

module.exports = async function (fastify, opts) {
  fastify.post('/api/login', async function (request, reply) {
    const { body } = request
    try {
      const user = await User.findOne({ email: body.email })
      const match = await bcrypt.compare(body.password, user.password)
      if (match) {
        request.session.set('session', { id: user._id })
        return reply.header('HX-Redirect', '/').send({ success: true })
      }
    } catch (err) {
      return reply.view('partials/alert', {
        success: false,
        message: 'Invalid credentials.',
      })
    }
  })
}
