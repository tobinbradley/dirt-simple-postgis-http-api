var Joi = require('joi'),
	squel = require('squel').useFlavour('postgres'),
	config = require('../config');


function formatSQL(request) {
	var transform = `
		ST_Transform(${request.query.force_on_surface ? 'ST_PointOnSurface' : 'ST_Centroid'}(
			${request.query.geom_column}), ${request.query.srid})
	`;
	var x = `
		ST_X(${transform})
	`;
	var y = `
		ST_Y(${transform})
	`;

	var sql =  squel.select()
		.from(request.params.table)
		.field(x, 'x')
		.field(y, 'y')
		.where(request.query.filter ? request.query.filter : '')
		.limit(10);

	return sql.toString();
}

module.exports = [{
	method: 'GET',
	path: '/centroid/v1/{table}',
	config: {
		description: 'feature centroid',
		notes: 'Get the centroid of a feature(s).',
		tags: ['api'],
		validate: {
			params: {
				table: Joi.string()
					.required()
					.description('name of the table')
			},
			query: {
				geom_column: Joi.string().default('geom')
					.description('The geometry column of the table. The default is <em>geom</em>.'),
				srid: Joi.number().integer().default(4326)
					.description('The SRID for the returned centroid. The default is <em>4326</em> Lat/Lng.'),
				filter: Joi.string()
					.description('Filtering parameters for a SQL WHERE statement.'),
				force_on_surface: Joi.boolean().default(false)
					.description('Set true to force point on surface. The default is the <em>false</em>.')
			}
		},
		jsonp: 'callback',
		cache: config.cache,
		handler: function(request, reply) {
			config.fetch.postgis(config.db.postgis, formatSQL(request), reply);
		}
	}
}];
