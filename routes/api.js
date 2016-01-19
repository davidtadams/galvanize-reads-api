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
      ).leftJoin("books_authors", "books.id", "books_authors.book_id")
      .leftJoin("authors", "authors.id", "books_authors.author_id")
      .orderBy('books.id', 'desc');
    },
    getOneBook: function(bookID) {
      return knex('books').select(
        'books.*',
        'authors.id as author_id',
        'authors.first_name',
        'authors.last_name'
      ).leftJoin("books_authors", "books.id", "books_authors.book_id")
      .leftJoin("authors", "authors.id", "books_authors.author_id")
      .where({'books.id': bookID});
    },
    createBook: function(bookData) {
      return knex('books').insert({
        title: bookData.title,
        genre: bookData.genre,
        description: bookData.description,
        cover_url: bookData.cover_url
      }, 'id')
    },
    associateBookAuthor: function(book_id, author_id) {
      return knex('books_authors').insert({
        book_id: book_id,
        author_id: author_id
      }).then(function(results) {
        return results.rowCount;
      })
    },
    deleteAllAssociationsBookAuthor: function(bookID) {
      return knex('books_authors').where('book_id', bookID).del();
    },
    deleteBook: function(bookID) {
      return knex('books').where({ 'books.id': bookID }).del();
    },
    updateBook: function(bookID, bookData) {
      return knex('books').where('id', bookID).update({
        title: bookData.title,
        genre: bookData.genre,
        description: bookData.description,
        cover_url: bookData.cover_url
      })
    }
  },
  authors: {
    getAllAuthors: function() {
      return knex ('authors').select(
        'authors.*',
        'books.id as book_id',
        'books.title as book_title'
      ).leftJoin("books_authors", "authors.id", "books_authors.author_id")
      .leftJoin("books", "books.id", "books_authors.book_id")
      .orderBy("authors.id", 'desc');
    }
  }
};
