// route query
const sql = (params, query) => {
  let bounds = query.bounds ? query.bounds.split(',').map(Number) : null;

  return `
    SELECT
      jsonb_build_object(
        'type',       'Feature',
        ${
          query.id_column ? `'id', ${query.id_column},` : ''
        }
        'geometry',   ST_AsGeoJSON(geom, ${parseInt(query.precision, 10)})::jsonb,
        'properties', to_jsonb( subq.* ) - 'geom' ${ query.id_column ? `- '${query.id_column}'` : '' }
      ) AS geojson

    FROM (
      SELECT
        ST_Transform(${query.geom_column}, 4326) as geom
        ${query.columns ? `, ${query.columns}` : ''}
        ${ query.id_column ? `, ${query.id_column}` : '' }
      FROM
        ${params.table},
        (SELECT ST_SRID(${query.geom_column}) AS srid FROM ${params.table} WHERE ${query.geom_column} IS NOT NULL LIMIT 1) a
      ${query.filter || bounds ? 'WHERE' : ''}
        ${query.filter ? `${query.filter}` : ''}
        ${query.filter && bounds ? 'AND' : ''}
        ${bounds && bounds.length === 4 ?
          `${query.geom_column} &&
          ST_Transform(
            ST_MakeEnvelope(${bounds.join()}, 4326),
            srid
          )
          `
          : ''
        }
        ${bounds && bounds.length === 3 ?
          `${query.geom_column} &&
          ST_Transform(
            ST_TileEnvelope(${bounds.join()}),
            srid
          )
          `
          : ''
        }
    ) as subq
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
      description: 'Columns to return as GeoJSON properites. The default is no columns. <br/><em>Note: the geometry column should not be listed here, and columns must be explicitly named.</em>'
    },
    id_column: {
      type: 'string',
      description:
        'Optional id column name to be used with Mapbox GL Feature State. This column must be an integer a string cast as an integer.'
    },
    filter: {
      type: 'string',
      description: 'Optional filter parameters for a SQL WHERE statement.'
    },
    bounds: {
      type: 'string',
      pattern: '^-?[0-9]{0,20}.?[0-9]{1,20}?(,-?[0-9]{0,20}.?[0-9]{1,20}?){2,3}$',
      description: 'Optionally limit output to features that intersect bounding box. Can be expressed as a bounding box (sw.lng, sw.lat, ne.lng, ne.lat) or a Z/X/Y tile (0,0,0).'
    },
    precision: {
      type: 'integer',
      description: 'The maximum number of decimal places to return. Default is 9.',
      default: 9
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
        if (err) {
          request.log.error(err)
          return reply.code(500).send({ error: "Database connection error." })
        }

        client.query(
          sql(request.params, request.query),
          function onResult(err, result) {
            release()
            if (err) {
              reply.send(err)
            } else {
                if (result.rows.length === 0) {
                reply.code(204).send()
              } else {
                const json = {
                  type: 'FeatureCollection',
                  features: result.rows.map((el) => el.geojson)
                }
                reply.send(json)
              }
            }
          }
        )
      }
    }
  })
  next()
}

module.exports.autoPrefix = '/v1'
