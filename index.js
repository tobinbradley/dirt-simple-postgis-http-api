const path = require('path')
const config = require('./config')
const fastify = require('fastify')({ logger: config.logger})

// postgres connection
fastify.register(require('fastify-postgres'), {
  connectionString: process.env.POSTGRES_CONNECTION || config.db
})

// compression - add x-protobuf
fastify.register(
  require('fastify-compress'),
  { customTypes: /x-protobuf$/ }
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

// swagger
fastify.register(require('fastify-swagger'), {
  exposeRoute: true,
  swagger: config.swagger
})

// static documentation path
fastify.register(require('fastify-static'), {
  root: path.join(__dirname, 'documentation')
})

// routes
fastify.register(require('fastify-autoload'), {
  dir: path.join(__dirname, 'routes')
})

// Launch server
fastify.listen(config.port, config.host || 'localhost', function (err, address) {
  if (err) {
    console.log(err)
    process.exit(1)
  }
  console.info(`Server listening on ${address}`)
})
