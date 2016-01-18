var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  var message = {
    hello: 'Welcome to the Galvanize Eats API!',
    message: 'Please use the documentation for correct API calls.',
    documentation: 'https://github.com/davidtadams/galvanize-reads-api/blob/master/README.md'
  };

  res.json(message);
});

module.exports = router;
