const Joi = require('joi');
const config = require('../config');
const db = require('../config/db.js');
const squel = require('squel').useFlavour('postgres');

function formatSQL(request) {
  var sql = squel
    .select()
    .from(request.params.table)
    .field(request.query.columns)
    .where(request.query.filter)
    .limit(request.query.limit);
  if (request.query.sort) {
    sql.order(request.query.sort);
  }
  if (request.query.group) {
    sql.group(request.query.group);
  }
  if (request.query.join) {
    var join = request.query.join.split(';');
    sql.join(join[0], null, join[1]);
  }

  return sql.toString();
}

module.exports = [
  {
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
            .description('name of the table'),
        },
        query: {
          columns: Joi.string()
            .default('*')
            .description(
              'The fields to return. The default is <em>all fields</em>.',
            ),
          filter: Joi.string()
            .default('')
            .description('Filtering parameters for a SQL WHERE statement.'),
          sort: Joi.string().description(
            'A field or fields to sort the return by.',
          ),
          limit: Joi.number()
            .integer()
            .max(1000)
            .min(1)
            .default(100)
            .description(
              'Limit the number of features returned. The default is <em>100</em>.',
            ),
          join: Joi.string().description(
            'A table to join and a join expression separated by a semicolon. Ex: <em>table2;table1.id = table2.id</em>',
          ),
          group: Joi.string().description('Column(s) to group by.'),
        },
      },
      jsonp: 'callback',
      cache: config.cache,
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
  },
];
