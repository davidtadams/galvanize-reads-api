var express = require('express');
var router = express.Router();
var api = require('./api');

router.get('/', function(req, res, next) {
  api.authors.getAllAuthors().then(function(authors) {
    var authorsResponse = { 'data': [] };

    for (var i = 0; i < authors.length; i++) {
      if (i != 0) {
        if (authors[i].id != authors[i - 1].id) {
          //not a duplicate author
          authorsResponse.data.push(addNewAuthor(authors[i]));
        } else {
          //is a duplicate author
          authorsResponse.data[authorsResponse.data.length - 1].books.push({
            book_id: authors[i].book_id,
            book_title: authors[i].book_title
          });
        }
      } else {
        authorsResponse.data.push(addNewAuthor(authors[i]));
      }
    }

    res.json(authorsResponse);
  })
});

function addNewAuthor(author) {
  var authorObject = { };

  for (var prop in author) {
    if (prop != 'book_title' && prop != 'book_id') {
      authorObject[prop] = author[prop];
    } else if (prop === 'book_title') {
      var bookTitle = author[prop];
    } else if (prop === 'book_id') {
      var bookID = author[prop];
    }
  }

  authorObject.books = [];
  if (bookTitle === null || bookID === null) {
    authorObject.books.push({
      book_id: "No books added",
      book_title: null
    });
  } else {
    authorObject.books.push({
      book_id: bookID,
      book_title: bookTitle
    });
  }

  return authorObject;
}

module.exports = router;
