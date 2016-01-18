var express = require('express');
var router = express.Router();
var api = require('./api');

router.get('/', function(req, res, next) {
  api.books.getAllBooks().then(function(books) {
    var booksResponse = { 'data': [] };

    for (var i = 0; i < books.length; i++) {
      if (i != 0) {
        if (books[i].id != books[i - 1].id) {
          //not a duplicate book
          booksResponse.data.push(addNewBook(books[i]));
        } else {
          //is a duplicate book
          booksResponse.data[booksResponse.data.length - 1].authors.push({
            author_id: books[i].author_id,
            first_name: books[i].first_name,
            last_name: books[i].last_name
          });
        }
      } else {
        booksResponse.data.push(addNewBook(books[i]));
      }
    }

    res.json(booksResponse);
  })
});






function addNewBook(book) {
  var bookObject = { };

  for (var prop in book) {
    if (prop != 'first_name' && prop != 'last_name' && prop != 'author_id') {
      bookObject[prop] = book[prop];
    } else if (prop === 'first_name') {
      var firstName = book[prop];
    } else if (prop === 'last_name') {
      var lastName = book[prop];
    } else if (prop === 'author_id') {
      var author_id = book[prop];
    }
  }

  bookObject.authors = [];
  bookObject.authors.push({
    author_id: author_id,
    first_name: firstName,
    last_name: lastName
  });

  return bookObject;
}

module.exports = router;
