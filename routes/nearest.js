// route query
const sql = (params, query) => {
  const [x, y, srid] = params.point.match(/^((-?\d+\.?\d+)(,-?\d+\.?\d+)(,[0-9]{4}))/)[0].split(',')

  return `
  SELECT
    ${query.columns},
    ST_Distance(
      ST_Transform(
        st_setsrid(st_makepoint(${x}, ${y}), ${srid}),
        (SELECT ST_SRID(${query.geom_column}) FROM ${params.table} LIMIT 1)
      ),
      ${query.geom_column}
    ) as distance

  FROM
  ${params.table}

  -- Optional Filter
  ${query.filter ? `WHERE ${query.filter}` : '' }

  ORDER BY
    ${query.geom_column} <-> ST_Transform(
      st_setsrid(st_makepoint(${x}, ${y}), ${srid}),
      (SELECT ST_SRID(${query.geom_column}) FROM ${params.table} LIMIT 1)
    )

  LIMIT ${query.limit}
  `
}

// route schema
const schema = {
  description: 'Find the records closest to a point in order of distance. Note that if no limit if given, all records are returned.',
  tags: ['api'],
  summary: 'records closest to point',
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
    limit: {
      type: 'integer',
      description: 'Limit the number of output features.',
      default: 10
    }
  }
}

// create route
module.exports = function (fastify, opts, next) {
  fastify.route({
    method: 'GET',
    url: '/nearest/:table/:point',
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
