require('babel/register');
var Hapi = require('hapi'),
    Inert = require('inert'),
    Vision = require('vision'),
    HapiSwagger = require('hapi-swagger'),
    Router = require('hapi-router'),
    config = require('./config');


// Create a server with a host and port
var server = new Hapi.Server();
server.connection({
    host: 'localhost',
    port: config.port,
  routes: {
    cors: true
  }
});

// Start the server
server.register([
    Inert,
    Vision,
    {
        register: Router,
        options: {
            routes: 'routes/*.js'
        }
    },
    {
        register: HapiSwagger,
        options: {
            apiVersion: '1.0.0',
            basePath: config.basePath,
            endpoint: '/docs',
            info: {
                title: 'Dirt-Simple PostGIS REST API',
                description: 'Created by Mecklenburg County GIS',
                license: 'Fork me on Github',
                licenseUrl: 'https://github.com/tobinbradley/dirt-simple-postgis-http-api'
            }
        }
    }],
    function (err) {
        server.start(function(){
            // Add any server.route() config here
            console.log('Server running at:', server.info.uri);
        });
    }
);
