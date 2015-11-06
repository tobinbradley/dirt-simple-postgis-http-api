var Joi = require('joi'),
	squel = require('squel').useFlavour('postgres'),
	config = require('../config');


function formatSQL(request) {
	var point = `
		ST_Transform(st_setsrid(st_makepoint(${request.params.x}, ${request.params.y}), ${request.params.srid}),
		find_srid('', '${request.params.table}', '${request.query.geom_column}'))
	`;
	var dwithin = `
		ST_DWithin(${request.params.table}.${request.query.geom_column},
			${point},
			${request.query.distance})
	`;

	var sql =  squel.select()
		.from(request.params.table)
		.field(request.query.columns)
		.where(dwithin)
		.where(request.query.filter)
		.limit(request.query.limit);
	if (request.query.sort) {
		sql.order(request.query.sort);
	}
	if (request.query.join) {
		var join = request.query.join.split(';');
		sql.join(join[0], null, join[1]);
	}

	return sql.toString();
}

module.exports = [{
	method: 'GET',
	path: '/intersect_point/v1/{table}/{x},{y}/{srid}',
	config: {
		description: 'intersect point',
		notes: 'Return records based on the intersection of a point and a table.',
		tags: ['api'],
		validate: {
			params: {
				table: Joi.string()
					.required()
					.description('name of the table to intersect'),
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
				distance: Joi.number().max(100000).min(0).default(0)
					.description('Buffer the overlay feature(s) by units of the geometry column. Default is <em>0</em>.'),
				sort: Joi.string()
					.description('A field or fields to sort the return by.'),
				join: Joi.string()
					.description('A table to join and a join expression separated by a semicolon. Ex: <em>table2;table1.id = table2.id</em>'),
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
