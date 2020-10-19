// route query
const sql = () => {
  return `
    SELECT * from geometry_columns;
  `
}

// route schema
const schema = {
  description: 'Return information in the geometry_columns view. Note the service login needs read permission on the geometry_columns view.',
  tags: ['meta'],
  summary: 'list PostGIS layers'
}

// create route
module.exports = function (fastify, opts, next) {
  fastify.route({
    method: 'GET',
    url: '/list_layers',
    schema: schema,
    handler: function (request, reply) {
      fastify.pg.connect(onConnect)

      function onConnect(err, client, release) {
        if (err) return reply.send({
          "statusCode": 500,
          "error": "Internal Server Error",
          "message": "unable to connect to database server"
        })

        client.query(
          sql(),
          function onResult(err, result) {
            release()
            reply.send(err || result.rows)
          }
        )
      }
    }
  })
  next()
}

module.exports.autoPrefix = '/v1'