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

router.get('/:authorID', function(req, res, next) {
  api.authors.getOneAuthor(req.params.authorID).then(function(author) {
    if (author.length <= 0) {
      res.json({
        error: "Author number: " + req.params.authorID + " does not exist"
      });
      return;
    }

    var authorResponse = { 'data': [] };

    for (var i = 0; i < author.length; i++) {
      if (i === 0) {
        //add first author
        authorResponse.data.push(addNewAuthor(author[i]));
      } else {
        //add additional books
        authorResponse.data[authorResponse.data.length - 1].books.push({
          book_id: author[i].book_id,
          book_title: author[i].book_title
        });
      }
    }

    res.json(authorResponse);
  })
});

router.post('/new', function(req, res, next) {
  if (req.body['first_name'] === undefined
        || req.body['last_name'] === undefined
        || req.body['bio'] === undefined
        || req.body['portrait_url'] === undefined) {
    res.json({
      error: "The post data is incomplete",
      documentation: 'https://github.com/davidtadams/galvanize-reads-api/blob/master/README.md'
    });
    return;
  }

  api.authors.createAuthor(req.body).then(function(author_id) {
    for (var i = 0; i < req.body.books.length; i++) {
      api.authors.associateAuthorBook(author_id[0], req.body.books[i])
        .then(function(results) {
          if (results != 1) {
            res.json({
              error: "Author not created correctly"
            })
            return;
          }
        })
    }

    res.json({
      success: "Author created successfully"
    })
  });
});

router.delete('/:authorID/delete', function(req, res, next) {
  api.authors.deleteAuthor(req.params.authorID).then(function(results) {
    if (results != 1) {
      res.json({
        error: "Unable to delete author: " + req.params.authorID
      })
      return;
    }

    res.json({
      success: "Author number: " + req.params.authorID + " was successfully deleted"
    })
  });
});

router.put('/:authorID/edit', function(req, res, next) {
  if (req.body['first_name'] === undefined
        || req.body['last_name'] === undefined
        || req.body['bio'] === undefined
        || req.body['portrait_url'] === undefined) {
    res.json({
      error: "The put data is incomplete",
      documentation: 'https://github.com/davidtadams/galvanize-reads-api/blob/master/README.md'
    });
    return;
  }

  api.authors.updateAuthor(req.params.authorID, req.body).then(function(results) {
    if (results != 1) {
      res.json({
        error: "Author not edited correctly"
      })
      return;
    }
    api.authors.deleteAllAssociationsAuthorBook(req.params.authorID).then(function(results) {
      for (var i = 0; i < req.body.books.length; i++) {
        api.authors.associateAuthorBook(req.params.authorID, req.body.books[i])
          .then(function(results) {
            if (results != 1) {
              res.json({
                error: "Author not created correctly"
              })
              return;
            }
          })
      }

      res.json({
        success: "Author number: " + req.params.authorID + " edited successfully"
      })
    }).catch(function(error) {
      console.log(error);
    })
  });
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
