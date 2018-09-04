const SphericalMercator = require('@mapbox/sphericalmercator');
const sm = new SphericalMercator({
  size: 256
});

// route query
const sql = (params, query) => {
  let bounds = query.bounds ? query.bounds.match(/^((-?\d+\.?\d+)(,-?\d+\.?\d+){2,3})/)[0].split(',') : null;
  bounds && bounds.length === 3 ? bounds = sm.bbox(bounds[1], bounds[2], bounds[0]) : null;

  return `
  SELECT 
    Row_to_json(fc) as geojson

  FROM (
    SELECT 
      'FeatureCollection' AS type, 
      COALESCE(Array_to_json(Array_agg(f)), '[]'::json) AS features

  FROM (
    SELECT 
      'Feature' AS type, 
      St_asgeojson(ST_Transform(lg.${query.geom_column}, 4326))::json AS geometry,
      ${query.columns ? ` 
      Row_to_json(
        (
          SELECT 
            l 
          FROM   
         (SELECT ${query.columns}) AS l
        )
      ) AS properties 
      ` : `'{}'::json AS properties`}
                
    FROM   
      ${params.table} AS lg
    
    -- Optional Filter
    ${query.filter || bounds ? 'WHERE' : ''}
    ${query.filter ? `${query.filter}` : '' }
    ${query.filter && bounds ? 'AND' : ''}
    ${bounds ? `
      ST_Intersects(
        ${query.geom_column},
        ST_Transform(
          ST_MakeEnvelope(${bounds[0]}, ${bounds[1]}, ${bounds[2]}, ${bounds[3]}, 4326), 
          (SELECT ST_SRID(${query.geom_column}) FROM ${params.table} LIMIT 1)
        )
      )
    ` : ''}

    ) AS f
  ) AS fc; 
  `
}

// route schema
const schema = {
  description: 'Return table as GeoJSON.',
  tags: ['feature'],
  summary: 'return GeoJSON',
  params: {
    table: {
      type: 'string',
      description: 'The name of the table or view.'
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
      description: 'Columns to return as GeoJSON properites. The default is no colums.'
    },
    filter: {
      type: 'string',
      description: 'Optional filter parameters for a SQL WHERE statement.'
    },
    bounds: {
      type: 'string',
      pattern: '^((-?\\d+\\.?\\d+)(,-?\\d+\\.?\\d+){2,3})',
      description: 'Optionally limit output to features that intersect bounding box. Can be expressed as a bounding box (sw.lng, sw.lat, ne.lng, ne.lat) or a Z/X/Y tile (0,0,0).'
    }
  }
}

// create route
module.exports = function (fastify, opts, next) {
  fastify.route({
    method: 'GET',
    url: '/geojson/:table',
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
            reply.send(err || result.rows[0].geojson)
          }
        )
      }
    }
  })
  next()
}

module.exports.autoPrefix = '/v1'