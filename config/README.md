# Configuration Options

```json
{
  "db": "postgres://user:password@server/database",
  "cache": 3600,
  "port": 3000,
  "host": "localhost",
  "swagger": {
    "basePath": null,
    "externalDocs": {
      "url": "https://github.com/tobinbradley/dirt-simple-postgis-http-api",
      "description": "Source code on Github"
    },
    "info": {
      "title": "Dirst Simple Postgres HTTP API",
      "description": "The Dirt-Simple PostGIS HTTP API is an easy way to expose geospatial functionality to your applications. It takes simple requests over HTTP and returns JSON, JSONP, or protobuf (Mapbox Vector Tile) to the requester. Although the focus of the project has generally been on exposing PostGIS functionality to web apps, you can use the framework to make an API to any database.",
      "version": "3"
    },
    "schemes": ["http", "https"],
    "tags": [
      {
        "name": "api",
        "description": "code related end-points"
      },
      {
        "name": "feature",
        "description": "features in common formats for direct mapping."
      },
      {
        "name": "meta",
        "description": "meta information for tables and views."
      }
    ]
  }
}
```

### db

`db` is the database connection string for Postgres.

### cache

`cache` sets the expiration length of the server response, in seconds.

### port

`port` sets the port number the server runs on.

### host

The server will bind to the `host` name or IP address that is supplied.
To listen on all available IPv4 interfaces it should be "0.0.0.0" or "::" to accept connections on all IPv6 addresses.
Default value is "localhost".

### swagger

The `swagger` options are fairly self explanatory. For more information, see the options for [fastify-swagger](https://github.com/fastify/fastify-swagger).

`swagger.basePath` sets a URL prefix for the documentation page when it forms service URLs. This is handy when you're using an Apache or Nginx proxy path rather than an A-name. For example, if you are proxying the services to `http://server.com/api`, you would set `swagger.basePath` to `"/api"`. Otherwise leave it set to `null`.
