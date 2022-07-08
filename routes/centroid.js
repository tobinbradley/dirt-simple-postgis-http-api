// route query
const sql = (params, query) => {
  return `
  SELECT
    -- Get X and Y of (potentially) geographically transformed geometry
    ST_X(
      ST_Transform(
        ${query.force_on_surface ? 'ST_PointOnSurface' : 'ST_Centroid'}(
          ${query.geom_column}
        ), ${query.srid})
    ) as x,
    ST_Y(
      ST_Transform(
        ${query.force_on_surface ? 'ST_PointOnSurface' : 'ST_Centroid'}(
          ${query.geom_column}
        ), ${query.srid})
    ) as y

  FROM
    ${params.table}

  -- Optional filter
  ${query.filter ? `WHERE ${query.filter}` : ''}

  `
}

// route schema
const schema = {
  description: 'Get the centroids of feature(s).',
  tags: ['api'],
  summary: 'feature(s) centroids',
  params: {
    table: {
      type: 'string',
      description: 'The name of the table or view to query.'
    }
  },
  querystring: {
    geom_column: {
      type: 'string',
      description: 'The geometry column of the table.',
      default: 'geom'
    },
    srid: {
      type: 'integer',
      description: 'The SRID for the returned centroids.',
      default: 4326
    },
    filter: {
      type: 'string',
      description: 'Optional filter parameters for a SQL WHERE statement.'
    },
    force_on_surface: {
      type: 'boolean',
      description: 'Set <em>true</em> to force point on surface. The default is <em>false</em>.',
      default: false
    }
  }
}

// create route
module.exports = function (fastify, opts, next) {
  fastify.route({
    method: 'GET',
    url: '/centroid/:table',
    schema: schema,
    handler: function (request, reply) {
      fastify.pg.connect(onConnect)

      function onConnect(err, client, release) {
        if (err) {
          request.log.error(err)
          return reply.code(500).send({ error: "Database connection error." })
        }

        client.query(sql(request.params, request.query), function onResult(
          err,
          result
        ) {
          release()
          reply.send(err || result.rows)
        })
      }
    }
  })
  next()
}

module.exports.autoPrefix = '/v1'
