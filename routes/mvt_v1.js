const dbgeo = require('dbgeo');
const SphericalMercator = require('@mapbox/sphericalmercator');
const sm = new SphericalMercator({
  size: 256
});
const zlib = require('zlib');
const vtpbf = require('vt-pbf');
const geojsonVt = require('geojson-vt');
const Joi = require('joi');
const config = require('../config');
const db = require('../config/db.js');
const squel = require('squel').useFlavour('postgres');

function formatSQL(request) {
  var sql = squel
    .select()
    .from(request.params.table)
    .field(request.query.columns)
    .field(
      `ST_Simplify(ST_Transform(${request.query
        .geom_column}, 4326), 0.000001) as geom`
    )
    .where(request.query.filter)
    .limit(request.query.limit);

  if (request.query.join) {
    var join = request.query.join.split(';');
    sql.join(join[0], null, join[1]);
  }

  var smBounds = sm.bbox(request.params.x, request.params.y, request.params.z);
  sql.where(
    `${request.query
      .geom_column} && ST_Transform(ST_MakeEnvelope(${smBounds.join(
      ','
    )} , 4326), find_srid('', '${request.params.table}', '${request.query
      .geom_column}'))`
  );

  return sql.toString();
}

module.exports = [
  {
    method: 'GET',
    path: '/mvt/v1/{table}/{z}/{x}/{y}',
    config: {
      description: 'Mapbox Vector Tile',
      notes: 'Return Mapbox Vector Tile as protobuf.',
      tags: ['api'],
      validate: {
        params: {
          table: Joi.string()
            .required()
            .description('Name of the table.'),
          z: Joi.number()
            .integer()
            .required()
            .description('Z of the Z/X/Y tile spec.'),
          x: Joi.number()
            .integer()
            .required()
            .description('X of the Z/X/Y tile spec.'),
          y: Joi.number()
            .integer()
            .required()
            .description('Y of the Z/X/Y tile spec.')
        },
        query: {
          geom_column: Joi.string()
            .default('geom')
            .description(
              'The geometry column of the table. The default is <em>geom</em>.'
            ),
          columns: Joi.string()
            .default('')
            .description(
              'Columns to return other than geom. The default is <em>no columns</em>.'
            ),
          filter: Joi.string()
            .default('')
            .description('Filtering parameters for a SQL WHERE statement.'),
          join: Joi.string().description(
            'A table to join and a join expression separated by a semicolon. Ex: <em>table2;table1.id = table2.id</em>'
          ),
          limit: Joi.number()
            .integer()
            .max(10000)
            .min(1)
            .default(5000)
            .description(
              'Limit the number of features returned. The default is <em>5000</em>. The max is 10000.'
            )
        }
      },
      jsonp: 'callback',
      cache: config.cache
    },
    handler: function(request, reply) {
      db
        .query(formatSQL(request))
        .then(function(data) {
          if (data.length > 0) {
            dbgeo.parse(
              data,
              {
                outputFormat: 'geojson',
                precision: 6
              },
              function(error, result) {
                var tileindex = geojsonVt(result);
                var tile = tileindex.getTile(
                  request.params.z,
                  request.params.x,
                  request.params.y
                );
                // pass in an object mapping layername -> tile object
                var buff = vtpbf.fromGeojsonVt(
                  {[request.params.table]: tile},
                  {version: 2}
                );
                zlib.gzip(buff, function(err, pbf) {
                  reply(pbf)
                    .header('Content-Type', 'application/x-protobuf')
                    .header('Content-Encoding', 'gzip');
                });
              }
            );
          } else {
            reply({
              error: 'error',
              error_details: 'no data found for this tile'
            }).code(404);
          }
        })
        .catch(function(err) {
          reply({
            error: 'error running query',
            error_details: err
          });
        });
    }
  }
];
