var path = require('path');
var knex = require('knex')({
  client: 'sqlite3',
  debug: true,
  connection: {
    filename: path.join(__dirname, '..', 'db.sqlite')
  },
  useNullAsDefault: true
});

/**
 * Returns a promise resolving the page object.
 */
exports.getPageByUrl = function (url) {
  return knex('pages')
    .where({ url: url })
    .select()
    .then(function (rows) {
      return rows[0];
    });
};

/**
 * Returns a promise resolving when the insert succeeds.
 */
exports.insertPage = function (page) {
  return knex('pages')
    .insert(page)
    .return(page);
};
