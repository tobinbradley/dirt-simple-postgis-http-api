var Joi = require('joi'),
    squel = require('squel').useFlavour('postgres'),
    config = require('../config'),
    pgp = require('pg-promise')(),
    dbgeo = require('dbgeo'),
    SphericalMercator = require('sphericalmercator'),
    sm = new SphericalMercator({
        size: 256
    }),
    zlib = require('zlib'),
    vtpbf = require('vt-pbf'),
    geojsonVt = require('geojson-vt');


function formatSQL(request) {
    var sql = squel.select()
        .from(request.params.table)
        .field(request.query.columns)
        .field(`ST_Transform(${request.query.geom_column}, 4326) as geom`)
        .where(request.query.filter)
        .limit(request.query.limit);

    if (request.query.join) {
        var join = request.query.join.split(';');
        sql.join(join[0], null, join[1]);
    }

    var smBounds = sm.bbox(request.params.x, request.params.y, request.params.z);
    sql.where(`${request.query.geom_column} && ST_Transform(ST_MakeEnvelope(${smBounds.join(',')} , 4326), find_srid('', '${request.params.table}', '${request.query.geom_column}'))`);

    return sql.toString();
}

module.exports = [{
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
                z: Joi.number().integer()
                    .required()
                    .description('Z of the Z/X/Y tile spec.'),
                x: Joi.number().integer()
                    .required()
                    .description('X of the Z/X/Y tile spec.'),
                y: Joi.number().integer()
                    .required()
                    .description('Y of the Z/X/Y tile spec.')
            },
            query: {
                geom_column: Joi.string().default('geom')
                    .description('The geometry column of the table. The default is <em>geom</em>.'),
                columns: Joi.string().default('*')
                    .description('Columns to return. The default is <em>all columns</em>.'),
                filter: Joi.string().default('')
                    .description('Filtering parameters for a SQL WHERE statement.'),
                join: Joi.string()
                    .description('A table to join and a join expression separated by a semicolon. Ex: <em>table2;table1.id = table2.id</em>'),
                limit: Joi.number().integer().max(10000).min(1).default(5000)
                    .description('Limit the number of features returned. The default is <em>5000</em>. The max is 10000.')
            }
        },
        jsonp: 'callback',
        cache: config.cache
    },
    handler: function(request, reply) {
        let db = pgp(config.db.postgis);
        db
            .query(formatSQL(request))
            .then(function(data) {
                dbgeo.parse(data, {
                    outputFormat: 'geojson',
                    precision: 6
                }, function(error, result) {
                    var tileindex = geojsonVt(result);
                    var tile = tileindex.getTile(parseInt(request.params.z, 10), parseInt(request.params.x, 10), parseInt(request.params.y));
                    // pass in an object mapping layername -> tile object
                    var buff = vtpbf.fromGeojsonVt({[request.params.table]: tile});
                    zlib.gzip(buff, function(err, pbf) {
                        reply(pbf)
                            .header('Content-Type', 'application/x-protobuf')
                            .header('Content-Encoding', 'gzip')
                            .header('Cache-Control', config.cache);
                    });
                });
            })
            .catch(function(err) {
                reply({
                    'error': 'error running query',
                    'error_details': err
                });
            });
    }

}];
