exports.seed = function(knex, Promise) {
  return Promise.all([
    knex('books_authors').insert({
      book_id: 1,
      author_id: 1
    }),
    knex('books_authors').insert({
      book_id: 1,
      author_id: 2
    }),
    knex('books_authors').insert({
      book_id: 1,
      author_id: 3
    }),
    knex('books_authors').insert({
      book_id: 2,
      author_id: 4
    }),
    knex('books_authors').insert({
      book_id: 3,
      author_id: 5
    }),
    knex('books_authors').insert({
      book_id: 4,
      author_id: 6
    }),
    knex('books_authors').insert({
      book_id: 5,
      author_id: 6
    }),
    knex('books_authors').insert({
      book_id: 6,
      author_id: 6
    })
  ]);
};
