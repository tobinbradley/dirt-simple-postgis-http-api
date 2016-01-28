var squel = require('squel').useFlavour('postgres'),
	config = require('../config');


function formatSQL() {
	return squel.select()
		.from('geometry_columns')
		.order('f_table_name').toString();
}

module.exports = [{
	method: 'GET',
	path: '/list_layers/v1',
	config: {
		description: 'list layers',
		notes: 'Returns a list of tables with geometry columns.',
		tags: ['api'],
		jsonp: 'callback',
		cache: config.cache,
		handler: function(request, reply) {
			config.fetch.postgis(config.db.postgis, formatSQL(request), reply);
		}
	}
}];
