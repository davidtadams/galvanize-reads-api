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
  });
});

router.get('/:bookID', function(req, res, next) {
  api.books.getOneBook(req.params.bookID).then(function(book) {
    if (book.length <= 0) {
      res.json({
        error: "Book number: " + req.params.bookID + " does not exist"
      });
      return;
    }

    var bookResponse = { 'data': [] };

    for (var i = 0; i < book.length; i++) {
      if (i === 0) {
        //add first book
        bookResponse.data.push(addNewBook(book[i]));
      } else {
        //add additional authors
        bookResponse.data[bookResponse.data.length - 1].authors.push({
          author_id: book[i].author_id,
          first_name: book[i].first_name,
          last_name: book[i].last_name
        });
      }
    }

    res.json(bookResponse);
  });
});

router.post('/new', function(req, res, next) {
  if (req.body['title'] === undefined
        || req.body['genre'] === undefined
        || req.body['description'] === undefined
        || req.body['cover_url'] === undefined) {
    res.json({
      error: "The post data is incomplete",
      documentation: 'https://github.com/davidtadams/galvanize-reads-api/blob/master/README.md'
    });
    return;
  }

  api.books.createBook(req.body).then(function(book_id) {
    for (var i = 0; i < req.body.authors.length; i++) {
      api.books.associateBookAuthor(book_id[0], req.body.authors[i])
        .then(function(results) {
          if (results != 1) {
            res.json({
              error: "Book not created correctly"
            })
            return;
          }
        })
    }

    res.json({
      success: "Book created successfully"
    })
  });
});

router.delete('/:bookID/delete', function(req, res, next) {
  api.books.deleteBook(req.params.bookID).then(function(results) {
    if (results != 1) {
      res.json({
        error: "Unable to delete book: " + req.params.bookID
      })
      return;
    }

    res.json({
      success: "Book number: " + req.params.bookID + " was successfully deleted"
    })
  });
});

router.put('/:bookID/edit', function(req, res, next) {
  if (req.body['title'] === undefined
        || req.body['genre'] === undefined
        || req.body['description'] === undefined
        || req.body['cover_url'] === undefined) {
    res.json({
      error: "The put data is incomplete",
      documentation: 'https://github.com/davidtadams/galvanize-reads-api/blob/master/README.md'
    });
    return;
  }

  api.books.updateBook(req.params.bookID, req.body).then(function(results) {
    if (results != 1) {
      res.json({
        error: "Book not edited correctly"
      })
      return;
    }
    api.books.deleteAllAssociationsBookAuthor(req.params.bookID).then(function(results) {
      for (var i = 0; i < req.body.authors.length; i++) {
        api.books.associateBookAuthor(req.params.bookID, req.body.authors[i])
          .then(function(results) {
            if (results != 1) {
              res.json({
                error: "Book not created correctly"
              })
              return;
            }
          })
      }

      res.json({
        success: "Book number: " + req.params.bookID + " edited successfully"
      })
    }).catch(function(error) {
      console.log(error);
    })
  });
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
  if (firstName === null || lastName === null || author_id === null) {
    bookObject.authors.push({
      author_id: "No authors added",
      first_name: null,
      last_name: null
    });
  } else {
    bookObject.authors.push({
      author_id: author_id,
      first_name: firstName,
      last_name: lastName
    });
  }

  return bookObject;
}

module.exports = router;
