var Joi = require('joi'),
    squel = require('squel').useFlavour('postgres'),
    config = require('../config'),
    pgp = require('pg-promise')();


function formatSQL(request) {
    var dwithin = `
    ST_DWithin(f.${request.query.geom_column_from},
      t.${request.query.geom_column_to},
      ${request.query.distance})
  `;

    var sql = squel.select()
        .from(request.params.table_from, 'f')
        .from(request.params.table_to, 't')
        .field(request.query.columns)
        .where(dwithin)
        .where(request.query.filter)
        .limit(request.query.limit);
    if (request.query.sort) {
        sql.order(request.query.sort);
    }

    return sql.toString();
}

module.exports = [{
    method: 'GET',
    path: '/intersect_feature/v1/{table_from}/{table_to}',
    config: {
        description: 'intersect feature(s)',
        notes: 'Return records based on the intersection of two geometry features.',
        tags: ['api'],
        validate: {
            params: {
                table_from: Joi.string()
                    .required()
                    .description('name of the table to use as overlay'),
                table_to: Joi.string()
                    .required()
                    .description('table to be interesected')
            },
            query: {
                geom_column_from: Joi.string().default('geom')
                    .description('The geometry column of the from_table. The default is <em>geom</em>.'),
                geom_column_to: Joi.string().default('geom')
                    .description('The geometry column of the to_table. The default is <em>geom</em>.'),
                columns: Joi.string().default('*')
                    .description('Columns to return. Field names should be prefaced by a f for the table_from and a t for the table_to (ex: f.pid, t.prkname). The default is <em>all columns</em>.'),
                filter: Joi.string().default('')
                    .description(`Filtering parameters for a SQL WHERE statement. Field names should be prefaced by a f for the from_table and a t for the to_table (ex: f.pid='11111111')`),
                distance: Joi.number().max(100000).min(0).default(0)
                    .description('Buffer the overlay feature(s) by units of the geometry column. Default is <em>0</em>.'),
                limit: Joi.number().integer().max(1000).min(1).default(10)
                    .description('Limit the number of features returned. The default is <em>10</em>.'),
                sort: Joi.string()
                    .description('A field or fields to sort the return by.')
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
