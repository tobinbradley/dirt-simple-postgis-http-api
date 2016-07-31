var Joi = require('joi'),
    squel = require('squel').useFlavour('postgres'),
    config = require('../config'),
    pgp = require('pg-promise')();


function formatSQL(request) {
    var sqlParts = [];
    var search = decodeURIComponent(request.query.tables);

    search.split(',').forEach(function(item) {
        var partial = squel.select()
            .from(config.search[item].table)
            .field(config.search[item].columns)
            .where(config.search[item].where, config.search[item].format(request.params.query))
            .limit(request.query.limit);

        sqlParts.push('(' + partial.toString() + ')');
    });

    var returnSQL = sqlParts.join(' union ') + ' order by type, label';
    return returnSQL;
}


module.exports = [{
    method: 'GET',
    path: '/search/v1/{query}',
    config: {
        description: 'list columns',
        notes: 'Returns a list of fields in the specified table.',
        tags: ['api'],
        validate: {
            params: {
                query: Joi.string()
                    .required()
                    .description('string to search for')
            },
            query: {
                tables: Joi.string().default('address')
                    .description('Comma delimited list of tables to search through. Each table must be defined in onfig. The default is <em>address</em>. Ex: <em>address,parcel,school</em>'),
                limit: Joi.number().integer().default(10)
                    .description('Limit of return result in each category. Default is <em>10</em>')
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
