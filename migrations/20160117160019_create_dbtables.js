exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTableIfNotExists('books', function(table) {
      table.increments('id');
      table.string('title').notNullable();
      table.string('genre').notNullable();
      table.text('description').notNullable();
      table.string('cover_url').notNullable();
    }),
    knex.schema.createTableIfNotExists('authors', function(table) {
      table.increments('id');
      table.string('first_name').notNullable();
      table.string('last_name').notNullable();
      table.text('bio').notNullable();
      table.string('portrait_url').notNullable();
    }),
    knex.schema.createTableIfNotExists('books_authors', function(table) {
      table.integer('book_id').references('id').inTable('books').onDelete('CASCADE');
      table.integer('author_id').references('id').inTable('authors').onDelete('CASCADE');
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTableIfExists('books_authors'),
    knex.schema.dropTableIfExists('books'),
    knex.schema.dropTableIfExists('authors')
  ]);
};
