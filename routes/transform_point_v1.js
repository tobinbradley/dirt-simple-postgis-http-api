var Joi = require('joi'),
    squel = require('squel').useFlavour('postgres'),
    config = require('../config'),
    pgp = require('pg-promise')();


function formatSQL(request) {
    var point = `
    ST_Transform(st_setsrid(st_makepoint(${request.params.x}, ${request.params.y}), ${request.params.srid}),
    ${request.query.srid_new})
  `;
    var x = `
    ST_X(${point})
  `;
    var y = `
    ST_Y(${point})
  `;

    var sql = squel.select()
        .from('')
        .field(x, 'x')
        .field(y, 'y')
        .limit(10);

    return sql.toString();
}

module.exports = [{
    method: 'GET',
    path: '/transform_point/v1/{x},{y}/{srid}',
    config: {
        description: 'transform point to a different coordinate system',
        notes: 'Transform a point to a different coordinate system.',
        tags: ['api'],
        validate: {
            params: {
                x: Joi.number()
                    .required()
                    .description('x coordinate'),
                y: Joi.number()
                    .required()
                    .description('y coordinate'),
                srid: Joi.number().integer()
                    .required()
                    .description('SRID of the coordinate')
            },
            query: {
                srid_new: Joi.number().integer().default(4326)
                    .description('The SRID of the coordinate system to return the point in. The default is <em>4326</em> Lat/Lng.')
            }
        },
        jsonp: 'callback',
        cache: config.cache,
        handler: function(request, reply) {
            let db = pgp(config.db.postgis);
            db
                .query(formatSQL(request))
                .then(function(data) {
                    reply(data);
                })
                .catch(function(err) {
                    reply({
                        'error': 'error running query',
                        'error_details': err
                    });
                });
        }
    }
}];
