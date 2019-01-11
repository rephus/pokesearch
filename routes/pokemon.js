var express = require('express');
var router = express.Router();
var fs = require('fs');
var elasticsearch = require('../elasticsearch/pokemon');

router.get('/json', function(req, res, next) {

  fs.readFile('pokemon.json', 'utf8', function(err, contents) {
    if (err) console.error("Unable to read file " + err); 
    var json = JSON.parse(contents);
     res.json(json);
  });
});

router.get('/search', function(req, res, next) {
  
  var q = req.query.q; 
  const response = elasticsearch.search(q);

  response.then(function(results) {
      res.json(results.hits.hits); 
    }, function(err) {
        console.error(err);
    });
});


module.exports = router;
