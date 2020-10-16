// route query
const sql = (params, query) => {
  return `
  SELECT COUNT(${query.column_name ? `${query.column_name}` : '*'}) FROM ${params.table}
  -- Optional Filter
  ${query.filter ? `WHERE ${query.filter}` : '' }
  -- Optional Group
  ${query.group ? `GROUP BY ${query.group}` : '' }
  `
}

// route schema
const schema = {
  description: 'Count query  rows of a table or view.',
  tags: ['api'],
  summary: 'table query count',
  params: {
    table: {
      type: 'string',
      description: 'The name of the table or view.'
    }
  },
  querystring: {
    filter: {
      type: 'string',
      description: 'Optional filter parameters for a SQL WHERE statement.'
    },
    group: {
      type: 'string',
      description: 'Optional column(s) to group by.'
    },
    column_name: {
      type: 'string',
      description: 'The name of the column to count.'
    }
  }
}

// create route
module.exports = function (fastify, opts, next) {
  fastify.route({
    method: 'GET',
    url: '/count/:table',
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
          sql(request.params, request.query),
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
