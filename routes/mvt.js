const SphericalMercator = require('@mapbox/sphericalmercator');
const sm = new SphericalMercator({
  size: 256
});

// route query
const sql = (params, query) => {
  let bounds = sm.bbox(params.x, params.y, params.z);

  return `
  SELECT 
    ST_AsMVT(q, '${params.table}', 4096, 'geom')
  
  FROM (
    SELECT
      ${query.columns ? `${query.columns},` : '' }
      ST_AsMVTGeom(
        ST_Transform(${query.geom_column}, 4326),
        ST_MakeEnvelope(${bounds[0]}, ${bounds[1]}, ${bounds[2]}, ${bounds[3]}, 4326),
        4096,
        256,
        true
      ) geom

    FROM 
      ${params.table}

    -- Optional Filter
    ${query.filter ? `WHERE ${query.filter}` : '' }
  ) q
  `
}


// route schema
const schema = {
  description: 'Return table as Mapbox Vector Tile (MVT). The layer name returned is the name of the table.',
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
      description: 'The geometry column of the table.',
      default: 'geom'
    },
    columns: {
      type: 'string',
      description: 'Optional columns to return with MVT. The default is no columns.'
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
    url: '/mvt/:table/:z/:x/:y',
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
            if (err) {
              reply.send(err)
            } else {
              const mvt = result.rows[0].st_asmvt;
              if (mvt.length === 0) {
                reply.code(204)
              }
              reply
                .header('Content-Type', 'application/x-protobuf')
                .send(mvt);
            }
          }
        )
      }
    }
  })
  next()
}

module.exports.autoPrefix = '/v1'