exports.seed = function(knex, Promise) {
  return Promise.all([
    knex('books_authors').del(),
    knex('books').del(),
    knex('authors').del()
  ]);
};
