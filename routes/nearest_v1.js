var Joi = require('joi'),
	squel = require('squel').useFlavour('postgres'),
	config = require('../config');


function formatSQL(request) {
	var point = `
		ST_Transform(st_setsrid(st_makepoint(${request.params.x}, ${request.params.y}), ${request.params.srid}),
		find_srid('', '${request.params.table}', '${request.query.geom_column}'))
	`;
	var distance = `
		ST_Distance(${point}, ${request.query.geom_column})
	`;
	var order = `
		${request.query.geom_column} <-> ${point}
	`;

	var sql =  squel.select()
		.from(request.params.table)
		.field(request.query.columns)
		.field(distance, 'distance')
		.where(request.query.filter)
		.order(order)
		.limit(request.query.limit);

	return sql.toString();
}

module.exports = [{
	method: 'GET',
	path: '/nearest/v1/{table}/{x},{y}/{srid}',
	config: {
		description: 'get nearest features',
		notes: 'Find the nearest features to a point.',
		tags: ['api'],
		validate: {
			params: {
				table: Joi.string()
					.required()
					.description('name of the table'),
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
				geom_column: Joi.string().default('geom')
					.description('The geometry column of the table. The default is <em>geom</em>.'),
				columns: Joi.string().default('*')
					.description('Columns to return. The default is <em>all columns</em>.'),
				filter: Joi.string().default('')
					.description('Filtering parameters for a SQL WHERE statement.'),
				limit: Joi.number().integer().max(1000).min(1).default(10)
					.description('Limit the number of features returned. The default is <em>10</em>.')
			}
		},
		jsonp: 'callback',
		cache: config.cache,
		handler: function(request, reply) {
			config.fetch.postgis(config.db.postgis, formatSQL(request), reply);
		}
	}
}];
