# Routes

The `routes` folder contains all of dirt's routes. They are loaded automatically at run time; drop a new route in the `routes` folder, fire up dirt, and the new route is loaded.

## Route design

Each route contains three sections: sql, schema, and the Fastify route itself.

### sql

```javascript
// route query
const sql = (params, query) => {
  return `
  SELECT
    attname as field_name,
    typname as field_type

  FROM
    pg_namespace, pg_attribute, pg_type, pg_class

  WHERE
    pg_type.oid = atttypid AND
    pg_class.oid = attrelid AND
    relnamespace = pg_namespace.oid AND
    attnum >= 1 AND
    relname = '${params.table}'
  `
}
```

The `sql` function returns SQL for execution by the Postgres server. An [ES2015 template string](https://babeljs.io/docs/en/learn#template-strings) is used place, sometimes optionally, arguments from the route into the SQL statement. It also allows for the writing of very clear and maintainable SQL.

The `params` function argument contains route parameters (i.e. parts of the URL path). The `query` function argument contains route query string arguments.

Compound route components, such as the X,Y,SRID argument of a point, are split apart in this section.

```javascript
// route query
const sql = (params, query) => {
  const [x, y, srid] = params.point.match(/^((-?\d+\.?\d+)(,-?\d+\.?\d+)(,[0-9]{4}))/)[0].split(',')

  return `
  SELECT
    ST_X(
      ST_Transform(
        st_setsrid(
          st_makepoint(${x}, ${y}),
          ${srid}
        ),
  ...
```

### schema

```javascript
// route schema
const schema = {
  description: 'Gets the bounding box of a feature(s).',
  tags: ['api'],
  summary: 'minimum bounding rectangle',
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
      description:
        'The SRID for the returned centroid. The default is <em>4326</em> WGS84 Lat/Lng.',
      default: 4326
    },
    filter: {
      type: 'string',
      description: 'Optional filter parameters for a SQL WHERE statement.'
    }
  }
}
```

The `schema` variable serves two purposes. First, the documentation in the schema is used by Swagger to create the route documentation. Second, inputs can optionally be validated and default values set. Inputs that don't pass validation return an error and are not passed to Postgres.

In additional to standard types like `integer` or `string`, you can also use regular expressions to validate inputs. This input pattern checks for two coordinates and a four digit SRID, separated by commas.

```javascript
point: {
  type: 'string',
  pattern: '^((-?\\d+\\.?\\d+)(,-?\\d+\\.?\\d+)(,[0-9]{4}))',
  description: 'A point expressed as <em>X,Y,SRID</em>. Note for Lng/Lat coordinates, Lng is X and Lat is Y.'
}
```

Fastify [recommends](https://www.fastify.io/docs/latest/Validation-and-Serialization/) using [JSON Schema](http://json-schema.org/), which is what dirt uses.

### route

```javascript
// create route
module.exports = function(fastify, opts, next) {
  fastify.route({
    method: 'GET',
    url: '/nearest/:table/:point',
    schema: schema,
    handler: function(request, reply) {
      fastify.pg.connect(onConnect)

      function onConnect(err, client, release) {
        if (err)
          return reply.send({
            statusCode: 500,
            error: 'Internal Server Error',
            message: 'unable to connect to database server'
          })

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
```

Fastify's [route documentation](https://www.fastify.io/docs/latest/Routes/) is excellent if anything here looks confusing. Depending on the route you're building, you may want to customize the reply based on your results. This example from the `mvt` route sends a `204` status code if the result is empty, and sets `application/x-protobuf` as the content type.

```javascript
if (err) {
  reply.send(err)
} else {
  const mvt = result.rows[0].st_asmvt
  if (mvt.length === 0) {
    reply.code(204).send()
  }
  reply.header('Content-Type', 'application/x-protobuf').send(mvt)
}
```

Route versioning is handled by the final line in the file.

```javascript
module.exports.autoPrefix = '/v1'
```

This value is added to the route as a prefix, i.e. `http://localhost:3000/v1/list_layers`. Using a prefix allows for easy versioning if a route is modified by incrementing the number. If a `v1` and `v2` exist for the same route, they will both be documented.

If you create a new route version and wish to discourage the use of the old route, you can add `hide: true` to the old route's schema and it will no longer appear in the Swagger documentation.
