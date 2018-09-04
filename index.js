const path = require('path')
const config = require('./config')
const fastify = require('fastify')()

// postgres connection
fastify.register(require('fastify-postgres'), {
  connectionString: config.db
})

// compression
fastify.register(
  require('fastify-compress'), {
    customTypes: /^text\/|\+json$|\+text$|\+xml|x-protobuf$/
  }
)

// cache
fastify.register(
  require('fastify-caching'), {
    privacy: 'private',
    expiresIn: config.cache
  }
)

// CORS
fastify.register(require('fastify-cors'))

// swagger docs
fastify.register(require('fastify-swagger'), {
  exposeRoute: true,
  swagger: {
    info: {
      title: 'Dirst Simple Postgres HTTP API',
      description: 'The Dirt-Simple PostGIS HTTP API is an easy way to expose geospatial functionality to your applications. It takes simple requests over HTTP and returns JSON, JSONP, or protobuf (Mapbox Vector Tile) to the requester. Although the focus of the project has generally been on exposing PostGIS functionality to web apps, you can use the framework to make an API to any database.',
      version: '3'
    },
    externalDocs: {
      url: 'https://github.com/tobinbradley/dirt-simple-postgis-http-api',
      description: 'Source code on Github'
    },
    schemes: config.schemes,
    host: config.swaggerpath,
    tags: [{
      name: 'api',
      description: 'code related end-points'
    }, {
      name: 'feature',
      description: 'features in common formats for direct mapping.'
    }, {
      name: 'meta',
      description: 'meta information for tables and views.'
    }]
  }
})

// routes
fastify.register(require('fastify-autoload'), {
  dir: path.join(__dirname, 'routes')
})


// Launch server
fastify.listen(config.port, function (err, address) {
  if (err) {
    console.log(err)
    process.exit(1)
  }
  console.info(`Server listening on ${address}`)
  console.info(`Documentation available at ${address}/documentation`)
})