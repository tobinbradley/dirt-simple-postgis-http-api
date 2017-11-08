const Joi = require('joi');
const config = require('../config');
const db = require('../config/db.js');
const squel = require('squel').useFlavour('postgres');

function formatSQL(request) {
  var point = `
    ST_Transform(st_setsrid(st_makepoint(${request.params.x}, ${request.params
    .y}), ${request.params.srid}),
    find_srid('', '${request.params.table}', '${request.query.geom_column}'))
  `;
  var distance = `
    ST_Distance(${point}, ${request.params.table}.${request.query.geom_column})
  `;
  var order = `
    ${request.query.geom_column} <-> ${point}
  `;

  var sql = squel
    .select()
    .from(request.params.table)
    .field(request.query.columns)
    .field(distance, 'distance')
    .where(request.query.filter)
    .order(order)
    .limit(request.query.limit);

  if (request.query.join) {
    var join = request.query.join.split(';');
    sql.join(join[0], null, join[1]);
  }

  return sql.toString();
}

module.exports = [
  {
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
          srid: Joi.number()
            .integer()
            .required()
            .description('SRID of the coordinate'),
        },
        query: {
          geom_column: Joi.string()
            .default('geom')
            .description(
              'The geometry column of the table. The default is <em>geom</em>.',
            ),
          columns: Joi.string()
            .default('*')
            .description(
              'Columns to return. The default is <em>all columns</em>.',
            ),
          filter: Joi.string()
            .default('')
            .description('Filtering parameters for a SQL WHERE statement.'),
          join: Joi.string().description(
            'A table to join and a join expression separated by a semicolon. Ex: <em>table2;table1.id = table2.id</em>',
          ),
          limit: Joi.number()
            .integer()
            .max(1000)
            .min(1)
            .default(10)
            .description(
              'Limit the number of features returned. The default is <em>10</em>.',
            ),
        },
      },
      jsonp: 'callback',
      cache: config.cache,
    },
    handler: function(request, reply) {
      db
        .query(formatSQL(request))
        .then(function(data) {
          reply(data);
        })
        .catch(function(err) {
          reply({
            error: 'error running query',
            error_details: err,
          });
        });
    },
  },
];
