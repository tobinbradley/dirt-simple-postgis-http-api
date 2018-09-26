# Configuration Options

```json
{
  "schemes": ["http", "https"],
  "port": 3000,
  "cache": 3600,
  "swaggerpath": null,
  "db": "postgres://user:password@server/database"
}
```

### schemes

`schemes` sets the available route options as shown in the service documentation.

### port

`port` sets the port number the server runs on.

### cache

`cache` sets the expiration length of the server response, in seconds.

### db

`db` is the database connection string for Postgres.

### swagger

The `swagger` options are fairly self explanatory. For more information, see the options for [fastify-swagger](https://github.com/fastify/fastify-swagger).

`swagger.basePath` sets a URL prefix for the documentation page when it forms service URLs. This is handy when you're using an Apache or Nginx proxy path rather than an A-name. For example, if you are proxying the services to `http://server.com/api`, you would set `swagger.basePath` to `"/api"`. If set to `null` this value is ignored.
