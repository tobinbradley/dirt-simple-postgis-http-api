// route query
const sql = (params, query) => {
  return `
  SELECT
    ${query.columns}

  FROM
    ${params.table_from},
    ${params.table_to}

  WHERE
    ST_DWithin(
      ${params.table_from}.${query.geom_column_from},
      ${params.table_to}.${query.geom_column_to},
      ${query.distance}
    )
    -- Optional Filter
    ${query.filter ? `AND ${query.filter}` : '' }

  -- Optional sort
  ${query.sort ? `ORDER BY ${query.sort}` : '' }

  -- Optional limit
  ${query.limit ? `LIMIT ${query.limit}` : '' }
  `
}

// route schema
const schema = {
  description: 'Transform a point to a different coordinate system.',
  tags: ['api'],
  summary: 'transform point to new SRID',
  params: {
    table_from: {
      type: 'string',
      description: 'Table to use as an overlay.'
    },
    table_to: {
      type: 'string',
      description: 'Table to be intersected.'
    }
  },
  querystring: {
    geom_column_from: {
      type: 'string',
      description: 'The geometry column of the from_table. The default is geom.',
      default: 'geom'
    },
    geom_column_to: {
      type: 'string',
      description: 'The geometry column of the to_table. The default is geom.',
      default: 'geom'
    },
    columns: {
      type: 'string',
      description: 'Columns to return. Columns should be prefaced by the table name if the column name exists in both tables (ex: f.pid, t.prkname). The default is all columns.',
      default: '*'
    },
    filter: {
      type: 'string',
      description: 'Optional filter parameters for a SQL WHERE statement.'
    },
    distance: {
      type: 'integer',
      description: 'Buffer the overlay feature(s) by units of the geometry column.',
      default: 0
    },
    sort: {
      type: 'string',
      description: 'Optional sort column(s).'
    },
    limit: {
      type: 'integer',
      description: 'Optional limit to the number of output features.'
    }
  }
}

// create route
module.exports = function (fastify, opts, next) {
  fastify.route({
    method: 'GET',
    url: '/intersect_feature/:table_from/:table_to',
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
