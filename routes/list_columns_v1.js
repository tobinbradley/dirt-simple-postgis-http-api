var Joi = require('joi'),
    squel = require('squel').useFlavour('postgres'),
    config = require('../config'),
    pgp = require('pg-promise')();


function formatSQL(request) {
    return squel.select()
        .from('pg_namespace, pg_attribute, pg_type, pg_class')
        .field('attname', 'field_name')
        .field('typname', 'field_type')
        .where('pg_type.oid = atttypid')
        .where('pg_class.oid = attrelid')
        .where('relnamespace = pg_namespace.oid')
        .where('attnum >= 1')
        .where('relname = ?', request.params.table)
        .toString();
}


module.exports = [{
    method: 'GET',
    path: '/list_columns/v1/{table}',
    config: {
        description: 'list columns',
        notes: 'Returns a list of fields in the specified table.',
        tags: ['api'],
        validate: {
            params: {
                table: Joi.string()
                    .required()
                    .description('name of the table')
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
