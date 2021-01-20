// route query
const sql = () => {
  return `
  SELECT
    i.table_name,
    i.table_type,
    g.f_geometry_column as geometry_column,
    g.coord_dimension,
    g.srid,
    g.type
  FROM
    information_schema.tables i
  LEFT JOIN geometry_columns g
  ON i.table_name = g.f_table_name
  WHERE
    i.table_schema not in  ('pg_catalog', 'information_schema')
  ORDER BY table_name
  `
}

// route schema
const schema = {
  description: 'List tables and views. Note the service user needs read permission on the geometry_columns view.',
  tags: ['meta'],
  summary: 'list tables'
}

// create route
module.exports = function (fastify, opts, next) {
  fastify.route({
    method: 'GET',
    url: '/list_tables',
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
          sql(),
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
