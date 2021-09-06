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

Add your Postgres connection information to `config/index.json.txt` and rename it `index.json`. Information on the config options can be found [here](config/README.md).

### Step 3: fire it up!

```bash
npm start
```

To view interactive documentation, head to [http://127.0.0.1:3000/](http://127.0.0.1:3000/).

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

## Tips and tricks

### Database

Your Postgres login will need select rights to any tables or views it should be able to access. For security, it should _only_ have select rights unless you plan to specifically add a route that writes to a table.

Dirt uses connection pooling, minimizing database connections.

### SQL Functions

If a query parameter looks like it should be able to handle SQL functions, it probably can. For example, the `columns` parameter for most queries can use the `count(*)` function. You can use any function in the database, including user defined functions.

### Mapbox vector tiles

The `mvt` route serves Mapbox Vector Tiles. The layer name in the returned protobuf will be the same as the table name passed as input. Here's an example of using both `geojson` and `mvt` routes with Mapbox GL JS.

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

### Rate Limiting

You can add rate limiting users by using the [fastify-rate-limit](https://github.com/fastify/fastify-rate-limit) plugin. This can be handy not only for regular connections but also to keep a wayward bot from eating your lunch.

```bash
npm install --save fastify-rate-limit
```

```javascript index.js
fastify.register(require('fastify-rate-limit'), {
  max: 100,
  timeWindow: '1 minute'
})
```

### More Tips

- The master branch of Dirt is now optimized for PostGIS 3. Some functions will work on earlier versions, but some (geobuf, geojson, mvt in particular) will not. Use the `postgis2x` branch if you need to support PostGIS 2.
- If you modify code or add a route, dirt will not see it until dirt is restarted.
- The Dirt login needs read rights to the `geometry_columns` view for the `list_layers` service to work.
- If you pass path parameters that have encoded slashes through an Apache proxy (i.e. `%2F`), Apache by default will reject those requests with a 404 (Docs: [AllowEncodedSlashes](https://httpd.apache.org/docs/2.4/mod/core.html#allowencodedslashes)). To fix that, add `AllowEncodedSlashes NoDecode` to the end of your httpd.conf.
