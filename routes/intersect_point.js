// route query
const sql = (params, query) => {
  const [x, y, srid] = params.point.match(/^((-?\d+\.?\d+)(,-?\d+\.?\d+)(,[0-9]{4}))/)[0].split(',')

  return `
  SELECT
    ${query.columns}

  FROM
    ${params.table}

  WHERE
    ST_DWithin(
      ${query.geom_column},
      ST_Transform(
        st_setsrid(
          st_makepoint(${x}, ${y}),
          ${srid}
        ),
        (SELECT ST_SRID(${query.geom_column}) FROM ${params.table} LIMIT 1)
      ),
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
    table: {
      type: 'string',
      description: 'The name of the table or view.'
    },
    point: {
      type: 'string',
      pattern: '^((-?\\d+\\.?\\d+)(,-?\\d+\\.?\\d+)(,[0-9]{4}))',
      description: 'A point expressed as <em>X,Y,SRID</em>. Note for Lng/Lat coordinates, Lng is X and Lat is Y.'
    }
  },
  querystring: {
    geom_column: {
      type: 'string',
      description: 'The geometry column of the table.',
      default: 'geom'
    },
    columns: {
      type: 'string',
      description: 'Columns to return.',
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
    url: '/intersect_point/:table/:point',
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
