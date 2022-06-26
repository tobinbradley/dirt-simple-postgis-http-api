const path = require('path')
const fastify = require('fastify')({ logger: process.env.SERVER_LOGGER || false})
require('dotenv').config()

// EXIT IF POSTGRES_CONNECTION ENV VARIABLE NOT SET
if (!("POSTGRES_CONNECTION" in process.env)) {
  throw new Error("Required ENV variable POSTGRES_CONNECTION is not set. Please see README.md for more information.");
}

// POSTGRES CONNECTION
fastify.register(require('@fastify/postgres'), {
  connectionString: process.env.POSTGRES_CONNECTION
})

// COMPRESSION
// add x-protobuf
fastify.register(
  require('@fastify/compress'),
  { customTypes: /x-protobuf$/ }
)

// CACHE SETTINGS
fastify.register(
  require('@fastify/caching'), {
    privacy: process.env.CACHE_PRIVACY || 'private',
    expiresIn: process.env.CACHE_EXPIRESIN || 3600,
    serverExpiresIn: process.env.CACHE_SERVERCACHE
  }
)

// CORS
fastify.register(require('@fastify/cors'))

// INITIALIZE SWAGGER
fastify.register(require('@fastify/swagger'), {
  exposeRoute: true,
  routePrefix: '/',
  swagger: {
    "info": {
      "title": "Dirst Simple Postgres HTTP API",
      "description": "The Dirt-Simple PostGIS HTTP API is an easy way to expose geospatial functionality to your applications. It takes simple requests over HTTP and returns JSON, JSONP, or protobuf (Mapbox Vector Tile) to the requester. Although the focus of the project has generally been on exposing PostGIS functionality to web apps, you can use the framework to make an API to any database.",
      "version": process.env.npm_package_version || ""
    },
    "externalDocs": {
      "url": "https://github.com/tobinbradley/dirt-simple-postgis-http-api",
      "description": "Source code on Github"
    },
    "schemes": [
      "http",
      "https"
    ],
    "tags": [{
      "name": "api",
      "description": "code related end-points"
    }, {
      "name": "feature",
      "description": "features in common formats for direct mapping."
    }, {
      "name": "meta",
      "description": "meta information for tables and views."
    }]
  }
})

// ADD ROUTES
fastify.register(require('@fastify/autoload'), {
  dir: path.join(__dirname, 'routes')
})

// LAUNCH SERVER
fastify.listen({port: process.env.SERVER_PORT || 3000, host: process.env.SERVER_HOST || '0.0.0.0'}, (err, address) => {
  if (err) {
    console.log(err)
    process.exit(1)
  }
  console.info(`Server listening on ${address}`)
})
