require('dotenv').load();

var knex = require('knex')({
  client: 'pg',
  connection: process.env.DATABASE_URL
});

module.exports = {
  books: {
    getAllBooks: function() {
      return knex('books').select(
        'books.*',
        'authors.id as author_id',
        'authors.first_name',
        'authors.last_name'
      ).innerJoin("books_authors", "books.id", "books_authors.book_id")
      .innerJoin("authors", "authors.id", "books_authors.author_id")
      .orderBy('books.id', 'desc');
    }
  },
  authors: {

  }
};
