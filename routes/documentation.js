// create route
module.exports = function (fastify, opts, next) {
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