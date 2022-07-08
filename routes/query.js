// route query
const sql = (params, query) => {
  return `
  SELECT
    ${query.columns}

  FROM
  ${params.table}

  -- Optional Filter
  ${query.filter ? `WHERE ${query.filter}` : '' }

  -- Optional Group
  ${query.group ? `GROUP BY ${query.group}` : '' }

  -- Optional sort
  ${query.sort ? `ORDER BY ${query.sort}` : '' }

  -- Optional limit
  ${query.limit ? `LIMIT ${query.limit}` : '' }

  `
}

// route schema
const schema = {
  description: 'Query a table or view.',
  tags: ['api'],
  summary: 'table query',
  params: {
    table: {
      type: 'string',
      description: 'The name of the table or view.'
    }
  },
  querystring: {
    columns: {
      type: 'string',
      description: 'Columns to return.',
      default: '*'
    },
    filter: {
      type: 'string',
      description: 'Optional filter parameters for a SQL WHERE statement.'
    },
    sort: {
      type: 'string',
      description: 'Optional sort by column(s).'
    },
    limit: {
      type: 'integer',
      description: 'Optional limit to the number of output features.',
      default: 100
    },
    group: {
      type: 'string',
      description: 'Optional column(s) to group by.'
    }
  }
}

// create route
module.exports = function (fastify, opts, next) {
  fastify.route({
    method: 'GET',
    url: '/query/:table',
    schema: schema,
    handler: function (request, reply) {
      fastify.pg.connect(onConnect)

      function onConnect(err, client, release) {
        if (err) {
          request.log.error(err)
          return reply.code(500).send({ error: "Database connection error." })
        }

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
