const path = require('path')

// create route
module.exports = function (fastify, opts, next) {
  fastify.register(require('fastify-static'), {
    root: path.join(__dirname, '../documentation')
  })
  fastify.route({
    method: 'GET',
    url: '/',
    schema: {
      hide: true
    },
    handler: function (request, reply) {
      reply.sendFile('index.html')
    }
  })
  next()
}