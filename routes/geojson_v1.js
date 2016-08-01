var Joi = require('joi'),
    squel = require('squel').useFlavour('postgres'),
    config = require('../config'),
    pgp = require('pg-promise')(),
    dbgeo = require('dbgeo'),
    SphericalMercator = require('sphericalmercator'),
    sm = new SphericalMercator({
        size: 256
    });


function formatSQL(request) {
    var sql = squel.select()
        .from(request.params.table)
        .field(request.query.columns)
        .field(`ST_Simplify(ST_Transform(${request.query.geom_column}, 4326), 0.000001) as geom`)
        .field(`ST_Transform(${request.query.geom_column}, 4326) as geom`)
        .where(request.query.filter)
        .limit(request.query.limit);
    if (request.query.join) {
        var join = request.query.join.split(';');
        sql.join(join[0], null, join[1]);
    }
    if (request.query.bounds) {
        var bounds = request.query.bounds.split(',');
        if (bounds.length === 4) {
            sql.where(`${request.query.geom_column} && ST_Transform(ST_MakeEnvelope(${bounds.join(',')} , 4326), find_srid('', '${request.params.table}', '${request.query.geom_column}'))`);
        } else if (bounds.length === 3) {
            var smBounds = sm.bbox(bounds[1], bounds[2], bounds[0]);
            sql.where(`${request.query.geom_column} && ST_Transform(ST_MakeEnvelope(${smBounds.join(',')} , 4326), find_srid('', '${request.params.table}', '${request.query.geom_column}'))`);
        }
    }

    return sql.toString();
}

module.exports = [{
    method: 'GET',
    path: '/geojson/v1/{table}',
    config: {
        description: 'geojson',
        notes: 'Return geojson.',
        tags: ['api'],
        validate: {
            params: {
                table: Joi.string()
                    .required()
                    .description('Name of the table.')
            },
            query: {
                geom_column: Joi.string().default('geom')
                    .description('The geometry column of the table. The default is <em>geom</em>.'),
                columns: Joi.string().default('*')
                    .description('Columns to return. The default is <em>all columns</em>.'),
                filter: Joi.string().default('')
                    .description('Filtering parameters for a SQL WHERE statement.'),
                bounds: Joi.string().default('')
                    .description('Clipping box for the output. Can be expressed as a bounding box (<em>sw.lng, sw.lat, ne.lng, ne.lat</em>) or a Z/X/Y tile (<em>0,0,0</em>).'),
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
                    reply(result);
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
