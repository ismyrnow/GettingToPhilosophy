var knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: './db.sqlite'
  },
  useNullAsDefault: true
});

// Create the pages table if it doesn't exist.
knex.schema.createTableIfNotExists('pages', function(t) {
  t.string('url').primary();
  t.string('title');
  t.string('firstLink');
}).then(function () {
  process.exit();
}).catch(function (err) {
  console.error(err);
  process.exit(1);
});
