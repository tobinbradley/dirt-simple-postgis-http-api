var Joi = require('joi'),
	squel = require('squel').useFlavour('postgres'),
	config = require('../config');


function formatSQL(request) {
	var extent = `
		ST_Extent(ST_Transform(${request.query.geom_column}, ${request.query.srid}))
	`;

	var sql =  squel.select()
		.from(request.params.table)
		.field(extent, 'extent')
		.where(request.query.filter ? request.query.filter : '')
		.limit(10);

	return sql.toString();
}

module.exports = [{
	method: 'GET',
	path: '/bbox/v1/{table}',
	config: {
		description: 'feature extent',
		notes: 'Gets the bounding box of a feature(s).',
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
					.description('The SRID for the returned centroid. The default is <em>4326</em> WGS84 Lat/Lng.'),
				filter: Joi.string()
					.description('Filtering parameters for a SQL WHERE statement.')
			}
		},
		jsonp: 'callback',
		cache: config.cache,
		handler: function(request, reply) {
			config.fetch.postgis(config.db.postgis, formatSQL(request), reply);
		}
	}
}];
