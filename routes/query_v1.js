var Joi = require('joi'),
	squel = require('squel').useFlavour('postgres'),
	config = require('../config');


function formatSQL(request) {
	var sql =  squel.select()
		.from(request.params.table)
		.field(request.query.columns)
		.where(request.query.filter)
		.limit(request.query.limit);
	if (request.query.sort) {
		sql.order(request.query.sort);
	}
	return sql.toString();
}


module.exports = [{
	method: 'GET',
	path: '/query/v1/{table}',
	config: {
		description: 'simple query',
		notes: 'Perform a simple query on a table.',
		tags: ['api'],
		validate: {
			params: {
				table: Joi.string()
					.required()
					.description('name of the table')
			},
			query: {
				columns: Joi.string().default('*')
					.description('The fields to return. The default is <em>all fields</em>.'),
				filter: Joi.string().default('')
					.description('Filtering parameters for a SQL WHERE statement.'),
				sort: Joi.string()
					.description('A field or fields to sort the return by.'),
				limit: Joi.number().integer().max(1000).min(1).default(100)
					.description('Limit the number of features returned. The default is <em>100</em>.')
			}
		},
		jsonp: 'callback',
		cache: config.cache,
		handler: function(request, reply) {
			config.fetch.postgis(config.db.postgis, formatSQL(request), reply);
		}
	}
}];
