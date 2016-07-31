# Getting Started

The Dirt-Simple PostGIS HTTP API is an easy way to expose geospatial functionality to your applications. It takes simple requests over HTTP and returns JSON or JSONP to the requester. Although the focus of the project has generally been on exposing PostGIS functionality to web apps, you can use the framework to make an API to any database.

This release uses Node. The previous release, based on PHP, is available in the v1 branch.

## Setup

#### PostgreSQL and PostGIS

You'll need PostgreSQL and PostGIS [set up](http://postgis.net/docs/manual-2.0/postgis_installation.html) with some data in it. Note the login you use for the API needs read rights to the geometry columns view and any tables or views you wish to make available. As this API is designed to be exposed to the web, I wouldn't recommend using a login with write or administrative access to Postgres.

#### Node

Install [Node](https://nodejs.org/en/). Then install the project dependencies:

``` bash
npm install
```


#### Configuration and Start

Rename `config/index.js.txt` to `config/index.js` and change the connection and other information to reflect your environment. Then start the server.

``` bash
node .
```

Set your browser to `http://localhost:8123/documentation` to get started. The documentation will allow you to interactively try the services, see the URL that gets built, as well as the results.

## Notes

The project uses the [HAPI](http://hapijs.com/) framework and supports CORS as well as JSONP for elderly IE. JSONP will automatically be returned if a `callback` query string is sent. The services are picked up from the files in the `routes` folder, so anything you add there will automatically be picked up.

Code changes, new routes, etc. are only picked up when the service starts. If you want to automatically restart the service on a code change, you can start it via [forever](https://github.com/foreverjs/forever) using a watch option:

``` bash
forever --watch --watchDirectory ./path/to/dir ./start/file
```

If your code change broke something, the service won't be able to restart, so this is risky.

The documentation is built using [Swagger](https://github.com/glennjones/hapi-swagger) based on descriptions in the code. Check out one of the files in `routes` and you'll see where it comes from.

Input validation and default values are handled via [joi](https://github.com/hapijs/joi), which allows for deep checking. The SQL queries are built using [Squel](https://hiddentao.github.io/squel/). While SQL isn't hard to write, complex string manipulation is ugly and error/injection prone, and Squel helps greatly with both of those things.

You should be able to do almost anything you need from `config/index.js`. It contains database connection, data fetching, and special operations for custom schemas, like the `search`. The individual routes contain documentation/validation for the route and a function to build the SQL call.

Babel is included in the project, so you can use ES6 features, although the only ES6 feature I'm using right now is template strings.

If you are proxying behind Apache, you'll need two proxies to deal with swagger. If you wanted to share your project at `/api`, you would need:

``` bash
ProxyPass /api http://localhost:8123
ProxyPass /docs http://localhost:8123/docs
```

You will also need to change `basePath` in `config/index.js` to `http://localhost/api`.
