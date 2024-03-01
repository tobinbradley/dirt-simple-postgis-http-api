# Dirt-Simple PostGIS HTTP API

The Dirt-Simple PostGIS HTTP API, or `dirt`, exposes PostGIS functionality to your applications over HTTP.

## Important Note!

**Dirt is now optimized for Postgis 3. If you're using Postgis 2.x, use the [postgis2x](https://github.com/tobinbradley/dirt-simple-postgis-http-api/tree/postgis2x) branch.**

## Getting started

### Requirements

- [Node](https://nodejs.org/)
- [PostgreSQL](https://postgresql.org/) with [PostGIS 3](https://postgis.net/)
- A PostgreSQL login for the service that has select rights to any tables or views you want to expose to dirt.

### Step 1: get the goodies

Note: if you don't have [git](https://git-scm.com/), you can download a [zip file](https://github.com/tobinbradley/dirt-simple-postgis-http-api/archive/master.zip) of the project instead.

```bash
git clone https://github.com/tobinbradley/dirt-simple-postgis-http-api.git dirt
cd dirt
npm install
```

### Step 2: add your configuration

Dirt is configured via environmental variables. These variables can be placed in a `.env` file in the project's root folder, via the command line at run time, or however you set environmental variables on your operating system. The only environmental variable that must be set is `POSTGRES_CONNECTION`, which contains your postgres login information.

#### `.env` file
```env
POSTGRES_CONNECTION="postgres://user:password@server/database"
```

#### command line, linux and mac
```
POSTGRES_CONNECTION="postgres://user:password@server/database" npm start
```

This is the complete complete list of environmental variables that can be set.

| Variable | Required | Default | Description |
| ----------- | ----------- | ----------- | ----------- |
| POSTGRES_CONNECTION | Yes | N/A | Postgres connection string |
| SERVER_LOGGER | No | undefined | Turn on Fastify's [error logger](https://www.fastify.io/docs/latest/Reference/Logging/). Options are `true` (same as `info`), `fatal`, `error`, `warn`, `info`, `debug`, `trace` or `silent`.  |
| SERVER_LOGGER_PATH | No | undefined | Log to file instead of console, ex: `/path/to/file`  |
| SERVER_HOST | No | 0.0.0.0 | IP to [listen](https://www.fastify.io/docs/latest/Reference/Server/#listen) on, default is all |
| SERVER_PORT | No | 3000 | Port to [listen](https://www.fastify.io/docs/latest/Reference/Server/#listen) on |
| BASE_PATH | No | / | The [base path](https://swagger.io/specification/v2/) on which the API is served, which is relative to the host |
| CACHE_PRIVACY | No | private | [Cache response directive](https://github.com/fastify/fastify-caching) |
| CACHE_EXPIRESIN | No | 3600 | [Max age in seconds](https://github.com/fastify/fastify-caching) |
| CACHE_SERVERCACHE | No | undefined | Max age in seconds for [shared cache](https://github.com/fastify/fastify-caching) (i.e. CDN) |
| RATE_MAX | No | undefined | Requests per minute [rate limiter](https://github.com/fastify/fastify-rate-limit) (limiter not used if RATE_LIMIT not set)  |
| SSL_ROOT_CERT | No | undefined | Contents of a CA certificate for connecting over SSL. Use this if you need to store the entire certificate in an environment variable, e.g. for Docker. |
| SSL_ROOT_CERT_PATH | No | undefined | Path to a CA certificate file for connecting over SSL. Note that setting `SSL_ROOT_CERT` overrides this. |


### Step 3: fire it up!

```bash
npm start
```

To view interactive documentation, head to [http://127.0.0.1:3000/](http://127.0.0.1:3000/).

### Running via Docker

To build a Docker image:

```
docker build -t dirt .
```

To run the Docker image:

```
docker run -dp 3000:3000 -e POSTGRES_CONNECTION=<connection string> dirt
```

## Architecture

### Due credit

The real credit for this project goes to the great folks behind the following open source software:

- [PostgreSQL](https://postgresql.org/)
- [PostGIS](https://postgis.net/)
- [Fastify](https://www.fastify.io/)

### How it works

The core of the project is [Fastify](https://www.fastify.io/).

> Fastify is a web framework highly focused on providing the best developer experience with the least overhead and a powerful plugin architecture. It is inspired by Hapi and Express and as far as we know, it is one of the fastest web frameworks in town.

Fastify is written by some of the core Node developers, and it's awesome. A number of Fastify plugins (fastify-autoload, fastify-caching, fastify-compress, fastify-cors, fastify-postgres, and fastify-swagger) are used to abstract away a lot of boilerplate. If you're looking for additional functionality, check out the [Fastify ecosystem](https://www.fastify.io/ecosystem).

All routes are stored in the `routes` folder and are automatically loaded on start. Check out the [routes readme](routes/README.md) for more information.

## Tips and Tricks

### Database

Your Postgres login will need select rights to any tables or views it should be able to access. That includes the `geometry_columns` view for the `list_layers` end point to work.

For security, it should _only_ have select rights unless you plan to specifically add a route that writes to a table.

Dirt uses connection pooling, minimizing database connections.

### SQL Functions

If a query parameter looks like it should be able to handle SQL functions, it probably can. For example, the `columns` parameter for most queries can use the `count(*)` function. You can use any function in the database, including user defined functions.

### Mapbox vector tiles

The `mvt` route serves Mapbox Vector Tiles. The layer name in the returned protobuf will be the same as the table name passed as input. Here's an example of using both `geojson` and `mvt` routes with MapLibre GL JS.

```javascript
map.on('load', function() {
  map.addLayer({
    id: 'dirt-mvt',
    source: {
      type: 'vector',
      tiles: ['http://localhost:3000/v1/mvt/voter_precinct/{z}/{x}/{y}'],
      maxzoom: 14,
      minzoom: 5
    },
    'source-layer': 'voter_precinct',
    type: 'fill',
    minzoom: 5,
    paint: {
      'fill-color': '#088',
      'fill-outline-color': '#333'
    }
  })

  map.addLayer({
    id: 'dirt-geojson',
    type: 'circle',
    source: {
      type: 'geojson',
      data: 'http://localhost:3000/v1/geojson/voter_polling_location'
    },
    paint: {
      'circle-radius': 2,
      'circle-color': '#bada55'
    }
  })
})
```

### Changes require a Restart

If you modify code or add a route, dirt will not see it until dirt is restarted.

### TLS/SSL

If you see an error like

```
no pg_hba.conf entry for host <host>, user <user>, database <database>, no encryption
```

you may need to connect to your server over SSL. Obtain a CA certificate and set `SSL_ROOT_CERT_PATH=<path to the certificate>` in `.env`. If you're still getting an error, check the end of your connection string for `?sslmode=require` and try removing it. You should still be able to connect over SSL.

If you're running Dirt on Docker, it may be easier to pass the contents of the certificate with `SSL_ROOT_CERT`. Example:

```bash
docker run -dp 3000:3000 -e POSTGRES_CONNECTION=<connection string> -e SSL_ROOT_CERT=$(cat ca.crt) dirt
```

If you can't get a certificate or want to bypass the error, you can try setting `NODE_TLS_REJECT_UNAUTHORIZED=0`. Note that this is unsafe and is not recommended in production.
