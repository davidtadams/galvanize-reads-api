var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.json({
    title: 'Express Server Working'
  });
});

module.exports = router;
