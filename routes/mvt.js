// route query
require("dotenv").config()

const sql = (params, query) => {
  return `
    WITH mvtgeom as (
      SELECT
        ST_AsMVTGeom (
          ST_Transform(${process.env.TABLE_COLUMN}, 3857),
          ST_TileEnvelope(${params.z}, ${params.x}, ${params.y})
        ) as geom
        ${query.columns ? `, ${query.columns}` : ''}
        ${query.id_column ? `, ${query.id_column}` : ''}
      FROM
        ${process.env.TABLE_NAME},
        (SELECT ST_SRID(${process.env.TABLE_COLUMN}) AS srid FROM ${process.env.TABLE_NAME} WHERE ${process.env.TABLE_COLUMN} IS NOT NULL LIMIT 1) a
      WHERE
        ST_Intersects(
          ${process.env.TABLE_COLUMN},
          ST_Transform(
            ST_TileEnvelope(${params.z}, ${params.x}, ${params.y}),
            srid
          )
        )

        -- Optional Filter
        ${`AND xform_id=${query.form_id} and geom is not null`}
    )
    SELECT ST_AsMVT(mvtgeom.*, '${process.env.TABLE_NAME}', 4096, 'geom' ${query.id_column ? `, '${query.id_column}'` : ''
    }) AS mvt from mvtgeom;
  `
}

// route schema
const schema = {
  description:
    'Return table as Mapbox Vector Tile (MVT). The layer name returned is the name of the table.',
  tags: ['feature'],
  summary: 'return MVT',
  params: {
    table: {
      type: 'string',
      description: 'The name of the table or view.'
    },
    z: {
      type: 'integer',
      description: 'Z value of ZXY tile.'
    },
    x: {
      type: 'integer',
      description: 'X value of ZXY tile.'
    },
    y: {
      type: 'integer',
      description: 'Y value of ZXY tile.'
    }
  },
  querystring: {
    geom_column: {
      type: 'string',
      description: 'Optional geometry column of the table. The default is geom.',
      default: 'geom'
    },
    columns: {
      type: 'string',
      description:
        'Optional columns to return with MVT. The default is no columns.'
    },
    id_column: {
      type: 'string',
      description:
        'Optional id column name to be used with Mapbox GL Feature State. This column must be an integer a string cast as an integer.'
    },
    filter: {
      type: 'string',
      description: 'Optional filter parameters for a SQL WHERE statement.'
    }
  }
}

// create route
module.exports = function (fastify, opts, next) {
  fastify.route({
    method: 'GET',
    url: '/mvt/:z/:x/:y',
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
          if (err) {
            reply.send(err)
          } else {
            const mvt = result.rows[0].mvt
            if (mvt.length === 0) {
              reply.code(204).send()
            }
            reply.header('Content-Type', 'application/x-protobuf').send(mvt)
          }
        })
      }
    }
  })
  next()
}

module.exports.autoPrefix = '/v1'
